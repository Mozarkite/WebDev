//server.js
require('dotenv').config();

//Core dependencies
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('./db'); //db.js handles PostgreSQL connection pooling

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_strong_secret';


/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parses data from html forms
app.use(express.static(__dirname)); //Manages images, files etc from the directory


/*
|--------------------------------------------------------------------------
| Authentication Helpers
|--------------------------------------------------------------------------
*/

function generateToken(user) {
  //user: user_id, username, email 
  return jwt.sign(
    { user_id: user.user_id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
} //Auto generates a JWT token for the user

function authMiddleware(req, res, next) {

  //Expect Authorization: Bearer l<token>
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const parts = authHeader.split(' ');
  //Checking if the first part is bearer, if not, give error
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization header' }); //Example token would look : "Bearer jwt-token"

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; //{ user_id, username, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/*
|--------------------------------------------------------------------------
| Public Authentication Routes
|--------------------------------------------------------------------------
*/

//Post Register
app.post('/register', async (req, res) => {
  try {

    //Basiv validation
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password are required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO Users (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING user_id, username, email
    `;
    const values = [username, hashedPassword, email];
    const result = await pool.query(query, values);

    const user = result.rows[0];
    const token = generateToken(user);

    res.json({ success: true, user, token });
  } catch (err) {
    console.error('Register error:', err);

    //Unique violation for email
    if (err.code === '23505') res.status(400).json({ error: 'Email already exists' });
    else res.status(500).json({ error: 'Server error' });
  }
});

//Post Login (authentication for existing users)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const query = `SELECT user_id, username, email, password= FROM Users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = generateToken({ user_id: user.user_id, username: user.username, email: user.email });
    res.json({ success: true, user: { user_id: user.user_id, username: user.username, email: user.email }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| Database Task Routes (Public)
|--------------------------------------------------------------------------
*/

//DB tasks with scrollable view
app.get('/db_tasks', async (req, res) => {
  try {
    //Search bar
    const q = (req.query.q || '').trim();
    if (q) {
      const query = `
        SELECT task_id, task_name, task_category, task_importance, task_time_limit
        FROM Db_tasks
        WHERE task_name ILIKE $1 OR task_category ILIKE $1
        ORDER BY task_importance DESC, task_name
        LIMIT 200
      `;
      const result = await pool.query(query, [`%${q}%`]);
      return res.json({ success: true, tasks: result.rows });
    } else {
      const query = `
        SELECT task_id, task_name, task_category, task_importance, task_time_limit
        FROM Db_tasks
        ORDER BY task_importance DESC, task_name
        LIMIT 200
      `;
      const result = await pool.query(query);
      return res.json({ success: true, tasks: result.rows });
    }
  } catch (err) {
    console.error('DB tasks error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| User Profile Routes (Protected)
|--------------------------------------------------------------------------
*/

//Protect username update - must be logged in, change username for the logged-in user only
app.post('/update-username', authMiddleware, async (req, res) => {
  try {
    const { newUsername } = req.body;
    if (!newUsername) return res.status(400).json({ error: 'New username required' });

    const query = `
      UPDATE Users
      SET username = $1
      WHERE user_id = $2
      RETURNING user_id, username, email
    `;
    const values = [newUsername, req.user.user_id];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result.rows[0];
    // issue a new token with updated username
    const token = generateToken(user);
    res.json({ success: true, user, token });
  } catch (err) {
    console.error('Server error in /update-username:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

//Delete account and cascade delete related data
app.post('/delete-account', authMiddleware, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `DELETE FROM User_to_do_list WHERE user_id = $1`,
      [req.user.user_id]
    );

    await client.query(
      `DELETE FROM User_tasks WHERE user_id = $1`,
      [req.user.user_id]
    );

    const result = await client.query(
      `DELETE FROM Users WHERE user_id = $1`,
      [req.user.user_id]
    );

    //No database rows were affected and transaction is rolled back
    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.json({ success: false, error: 'User not found' });
    }

    await client.query('COMMIT');
    res.json({ success: true });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete account error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
    //Ensures no connections are leaked
  } finally {
    client.release();
  }
});


/*
|--------------------------------------------------------------------------
|Task Management Routes (Protected)
|--------------------------------------------------------------------------
*/

//Add a premade DB task to user's to-do list
app.post('/add-db-task', authMiddleware, async (req, res) => {
  try {
    const { task_id } = req.body;

    if (!task_id) {
      return res.json({ success: false, error: 'task_id required' });
    }

    const taskResult = await pool.query(`
      SELECT task_id, task_name, task_category, task_importance, task_time_limit
      FROM Db_tasks
      WHERE task_id = $1
    `, [task_id]);

    if (taskResult.rows.length === 0) {
      return res.json({ success: false, error: 'Task not found' });
    }

    const t = taskResult.rows[0];

    const insertResult = await pool.query(`
      INSERT INTO User_to_do_list
        (user_id, db_task_id, task_name, task_category, task_importance, task_time_limit)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      req.user.user_id,
      t.task_id,
      t.task_name,
      t.task_category,
      t.task_importance,
      t.task_time_limit
    ]);

    res.json({ success: true, todo: insertResult.rows[0] });

  } catch (err) {
    console.error('Add DB task error:', err);
    res.json({ success: false, error: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
|Load logged-in user's to-do list
|--------------------------------------------------------------------------
|Returns all tasks (DB + user-created) added to the user's active list.
|Ordered by most recently added.
*/
app.get('/my-tasks', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM User_to_do_list
      WHERE user_id = $1
      ORDER BY added_at DESC
      `,
      [req.user.user_id]
    );

    res.json({ success: true, tasks: result.rows });
  } catch (err) {
    console.error('Load user tasks error:', err);
    res.json({ success: false, error: 'Server error' });
  }
});


/*
|--------------------------------------------------------------------------
|Mark a to-do task as completed
|--------------------------------------------------------------------------
|Only updates tasks that belong to the logged-in user.
|Expects todo_id from the frontend.
*/
app.post('/complete-task', authMiddleware, async (req, res) => {
  try {
    const { task_id } = req.body;

    // todo_id is required
    if (!task_id) {
      return res.json({ success: false, error: 'task_id required' });
    }

    const result = await pool.query(
      `
      UPDATE User_to_do_list
      SET completed = TRUE
      WHERE todo_id = $1 AND user_id = $2
      RETURNING *
      `,
      [task_id, req.user.user_id]
    );

    //Either task does not exist or does not belong to user
    if (result.rows.length === 0) {
      return res.json({ success: false, error: 'Task not found or not yours' });
    }

    res.json({ success: true, task: result.rows[0] });
  } catch (err) {
    console.error('Complete task error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


/*
|--------------------------------------------------------------------------
|Load user-created tasks (NOT to-do list)
|--------------------------------------------------------------------------
|These are tasks authored by the user and used for:
|- task history
|- favouriting eligibility
*/
app.get('/user-tasks', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM User_tasks
      WHERE user_id = $1
      `,
      [req.user.user_id]
    );

    res.json({ success: true, tasks: result.rows });
  } catch (err) {
    console.error('Get user tasks error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


/*
|--------------------------------------------------------------------------
| Create a new user-authored task
|--------------------------------------------------------------------------
|Inserts into:
|User_tasks (authoritative task definition)
|User_to_do_list (active task instance)
*/
app.post('/create-user-task', authMiddleware, async (req, res) => {
  try {
    const {
      task_name,
      task_category,
      task_importance,
      task_time_limit
    } = req.body;

    //Required fields validation
    if (!task_name || !task_category || !task_importance) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert into User_tasks (ownership-based table)
    const userTaskResult = await pool.query(
      `
      INSERT INTO User_tasks
        (user_id, task_name, task_category, task_importance, task_time_limit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        req.user.user_id,
        task_name,
        task_category,
        task_importance,
        task_time_limit || null
      ]
    );

    const userTask = userTaskResult.rows[0];

    //Insert into User_to_do_list (active instance)
    const todoResult = await pool.query(
      `
      INSERT INTO User_to_do_list
        (user_id, user_task_id, task_name, task_category, task_importance, task_time_limit)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        req.user.user_id,
        userTask.task_id,
        userTask.task_name,
        userTask.task_category,
        userTask.task_importance,
        userTask.task_time_limit
      ]
    );

    res.json({
      success: true,
      user_task: userTask,
      todo: todoResult.rows[0]
    });
  } catch (err) {
    console.error('Create user task error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



/*
|--------------------------------------------------------------------------
|Toggle favourite for user-created tasks only
|--------------------------------------------------------------------------
| -Enforces ownership
| -Ensures no DB tasks are favourited here
| -Uses transaction for atomic toggle
*/
app.post('/toggle-user-task-favourite', authMiddleware, async (req, res) => {
  const { user_task_id } = req.body;

  if (!user_task_id) {
    return res.status(400).json({ success: false, error: 'user_task_id required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Ensure task belongs to user
    const owned = await client.query(
      `
      SELECT task_id
      FROM User_tasks
      WHERE task_id = $1 AND user_id = $2
      `,
      [user_task_id, req.user.user_id]
    );

    if (owned.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({ success: false, error: 'Task not found or not yours' });
    }

    // Check current favourite state
    const existing = await client.query(
      `
      SELECT favourite_id
      FROM User_favourited_tasks
      WHERE user_id = $1 AND user_task_id = $2
      `,
      [req.user.user_id, user_task_id]
    );

    // Unfavourite
    if (existing.rows.length > 0) {
      await client.query(
        `DELETE FROM User_favourited_tasks WHERE favourite_id = $1`,
        [existing.rows[0].favourite_id]
      );

      await client.query('COMMIT');
      return res.json({ success: true, favourited: false });
    }

    // Favourite
    await client.query(
      `
      INSERT INTO User_favourited_tasks (user_id, user_task_id, db_task_id)
      VALUES ($1, $2, NULL)
      `,
      [req.user.user_id, user_task_id]
    );

    await client.query('COMMIT');
    res.json({ success: true, favourited: true });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('toggle-user-task-favourite error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
});


/*
|--------------------------------------------------------------------------
| Load favourited user-created tasks
|--------------------------------------------------------------------------
| Used exclusively by the Favourite Tasks page.
*/
app.get('/favourite-user-tasks', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        ut.task_id AS user_task_id,
        ut.task_name,
        ut.task_category,
        ut.task_importance,
        ut.task_time_limit,
        ft.favourited_at
      FROM User_favourited_tasks ft
      JOIN User_tasks ut ON ft.user_task_id = ut.task_id
      WHERE ft.user_id = $1
      ORDER BY ft.favourited_at DESC
      `,
      [req.user.user_id]
    );

    res.json({ success: true, tasks: result.rows });
  } catch (err) {
    console.error('favourite-user-tasks error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


/*
|--------------------------------------------------------------------------
|Fetch favourited task IDs (for UI state sync)
|--------------------------------------------------------------------------
|Used to pre-render hearts correctly on page load.
*/
app.get('/favourited-user-task-ids', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT user_task_id
      FROM User_favourited_tasks
      WHERE user_id = $1 AND user_task_id IS NOT NULL
      `,
      [req.user.user_id]
    );

    res.json({
      success: true,
      ids: result.rows.map(r => r.user_task_id)
    });
  } catch (err) {
    console.error('favourited-user-task-ids error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


/*
|--------------------------------------------------------------------------
|SPA Fallback
|--------------------------------------------------------------------------
*/

//Fallback to index.html for SPA routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/*
|--------------------------------------------------------------------------
|Server Startup
|--------------------------------------------------------------------------
*/


// Start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
