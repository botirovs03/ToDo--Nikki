const mysql = require('mysql2');

const connection = mysql.createConnection({
  // host: 'localhost',
  // user: 'root',
  // password: 'root',
  // database: 'todo',

  host: '192.168.100.75',
  user: 'bsremote',
  password: '3b3s2001Remote##',
  database: 'todo'
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
