const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') res.status(400).json({ error: 'Email already exists' });
    else res.status(500).json({ error: 'Server error' });
  }
});

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

    res.json({ success: true, user: { user_id: user.user_id, username: user.username, email: user.email }});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/update-username', async (req, res) => {
  console.log('Update username called', req.body);
  try {
    const { oldUsername, newUsername } = req.body;
    if (!oldUsername || !newUsername) return res.status(400).json({ error: 'Both old and new username are required' });

    const query = `
      UPDATE Users
      SET username = $1
      WHERE username = $2
      RETURNING user_id, username, email
    `;
    const values = [newUsername, oldUsername];

    const result = await pool.query(query, values);
    console.log('DB update result:', result.rows);

    if (result.rows.length === 0) return res.status(400).json({ error: 'Old username not found' });

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Server error in /update-username:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/delete-account', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ success: false, error: 'Username required' });

    const query = `DELETE FROM Users WHERE username = $1 RETURNING user_id`;
    const result = await pool.query(query, [username]);

    if (result.rowCount === 0) {
      return res.json({ success: false, error: 'User not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});




app.use(express.static(__dirname));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
