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
  database: 'uav'
});


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});



// Set up API routes
app.get('/sensor', (req, res) => {
  connection.query('SELECT * FROM sensor', (err, results) => {
    if (err) {
      console.error('Error executing the database query: ', err);
      res.status(500).send('Error fetching users');
      return;
    }

    const sensor = results.map(row => ({
      id: row.Sensor_ID,
      type: row.Sensor_Type,
      datatype: row.Data_type,
      status: row.Status
    }));

    res.json(sensor);
  });
});

app.get('/conclusion', (req, res) => {
  connection.query('SELECT * FROM conclusion', (err, results) => {
    if (err) {
      console.error('Error executing the database query: ', err);
      res.status(500).send('Error fetching users');
      return;
    }

    const conclusion = results.map(row => ({
      id: row.Conclusion_ID,
      description: row.Case_description,
    }));

    res.json(conclusion);
  });
});
// Route for fetching data from both 'datareport' and 'measurement' tables
app.get('/data', (req, res) => {
  const sql = `
    SELECT datareport.datareport_id, measurement.raw_data, conclusion.case_description, measurement.time_captured
    FROM datareport
    JOIN measurement ON datareport.measurement_id = measurement.measurement_id
    JOIN conclusion ON datareport.conclusion_id = conclusion.conclusion_id;
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data from both tables:', err);
      res.status(500).json({ error: 'Error fetching data from both tables' });
      return;
    }

    const data = results.map(row => ({
      id: row.datareport_id,
      data: row.raw_data,
      conclusion: row.case_description,
      time: row.time_captured
    }));

    res.json(data);
  });
});

// Assuming you have already imported required libraries and established a connection to the database

app.post('/caseadd', (req, res) => {
  // Access the data sent from the client
  const { input } = req.body;
  
  // Define the SQL query
  const sql = `
    INSERT INTO conclusion (case_description)
    VALUES (?);
  `;
  
  // Execute the SQL query
  connection.query(sql, [input], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      // Send an error response to the client
      return res.status(500).json({ error: 'Error inserting data into the database' });
    }
    
    console.log('Data inserted successfully');
    // Send a success response to the client
    res.json({ message: 'Data inserted successfully' });
  });

  // Log the received data
  console.log('Received input:', input);
});


const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});