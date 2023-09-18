const mysql = require('mysql2');

const connection = mysql.createConnection({
  // host: 'localhost',
  // user: 'root',
  // password: 'root',
  // database: 'todo',

  host: '192.168.100.75',
  user: 'bsremote',
  password: '3b3s2001Remote##',
  database: 'todo',
  connectTimeout: 2000,
  reconnect: {
    maxDelay: 2000, // Maximum delay between reconnection attempts (in milliseconds)
    initialDelay: 1000, // Initial delay for the first reconnection attempt (in milliseconds)
  },
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
