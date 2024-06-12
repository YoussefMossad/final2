const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ' ',
  database: process.env.DB_NAME || 'user_auth',
})

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});
app.get('/', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) throw error;
    res.send(`The solution is: ${results[0].solution}`);
  });
});

app.post('/Register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('User registered successfully!');
  });
});

app.post('/Login', (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    res.send('User logged in successfully!');
  });
});

app.listen(5000,process.env.PORT, () => {
  console.log('Server started on port .....');
});
