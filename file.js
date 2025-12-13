// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // your existing pg pool

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_strong_secret';

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parses data from html forms
app.use(express.static(__dirname)); //Manages images, files etc from the directory

//Auth Helpers
function generateToken(user) {
  //user: user_id, username, email 
  return jwt.sign(
    { user_id: user.user_id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
} //Auto generates a JWT token for the user

function authMiddleware(req, res, next) {

  //Expect Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const parts = authHeader.split(' ');
  //Checking if the first part is bearer, if not, give error
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization header' }); //Example token would look : "Bearer jwt-token"

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { user_id, username, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

//Public Routes

//Post Register
app.post('/register', async (req, res) => {
  try {
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
    if (err.code === '23505') res.status(400).json({ error: 'Email already exists' });
    else res.status(500).json({ error: 'Server error' });
  }
});

//Post Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const query = `SELECT user_id, username, email, password FROM Users WHERE email = $1`;
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
  } finally {
    client.release();
  }
});

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

app.get('/my-tasks', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM User_to_do_list
      WHERE user_id = $1
      ORDER BY added_at DESC
    `, [req.user.user_id]);

    res.json({ success: true, tasks: result.rows });

  } catch (err) {
    console.error('Load user tasks error:', err);
    res.json({ success: false, error: 'Server error' });
  }
});

app.post('/create-user-task', authMiddleware, async (req, res) => {
  try {
    const {
      task_name,
      task_category,
      task_importance,
      task_time_limit
    } = req.body;

    if (!task_name || !task_category || !task_importance) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    //Insert into User_tasks
    const userTaskResult = await pool.query(`
      INSERT INTO User_tasks
        (user_id, task_name, task_category, task_importance, task_time_limit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      req.user.user_id,
      task_name,
      task_category,
      task_importance,
      task_time_limit || null
    ]);

    const userTask = userTaskResult.rows[0];

    //Insert into User_to_do_list
    const todoResult = await pool.query(`
      INSERT INTO User_to_do_list
        (user_id, user_task_id, task_name, task_category, task_importance, task_time_limit)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      req.user.user_id,
      userTask.task_id,
      userTask.task_name,
      userTask.task_category,
      userTask.task_importance,
      userTask.task_time_limit
    ]);

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




//Fallback to index.html for SPA routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
