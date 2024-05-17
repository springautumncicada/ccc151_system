const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set up MySQL connection
const connection = mysql.createConnection({
//You can use localhost or 127.0.0.1
//host: 'localhost',
  host: '127.0.0.1',
  user: 'root',
  password: '',
//NOTE: change database name accordingly
  database: 'lab_exercises'
});

// Connect to the MySQL database
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the MySQL server');
});
// Serve the app.js file with content-type set to text/javascript
app.get('/app.js', (req, res) => {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'app.js'));
});
// Serve the style.css file with content-type set to text/css
app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'style.css'));
});
// Serve the index.html file
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});



// Set up API routes
app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error executing the database query: ', err);
      res.status(500).send('Error fetching users');
      return;
    }

    const users = results.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      age: row.age
    }));

    res.json(users);
  });
});

app.post('/api/users', (req, res) => {
  // Handle adding a new user to the database
  const { name, email , age} = req.body;
  const user = { name, email, age };
  if (!name || !email || !age) {
    return res.status(400).json({ error: "Name, email, and age are required." });
  }

  connection.query('INSERT INTO users SET ?', user, (err, result) => {
    if (err) {
      console.error('Error executing the database query: ', err);
      res.status(500).send('Error adding user');
      return;
    }
  
    const insertedUser = {
      id: result.insertId,
      name: user.name,
      email: user.email,
      age: user.age
    };
  
    res.send(insertedUser);
  });
  
});

app.put('/api/users/:id', (req, res) => {
  const { name, email, age } = req.body;
  const id = req.params.id;

  if (!name || !email || !age) {
    return res.status(400).json({ error: "Name, email, and age are required." });
  }

  connection.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id], (err, result) => {
    if (err) {
      console.error('Error executing the database query: ', err);
      return res.status(500).send('Error updating user');
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ id, name, email, age });
  });
});


app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;

  connection.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error executing the database query: ', err);
      return res.status(500).send('Error deleting user');
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ id });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
