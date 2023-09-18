const mysql = require('mysql2');

// Define your database connection configuration in a single object
const dbConfig = {
  host: 'sql.freedb.tech',
  user: 'freedb_nikkiUser',
  database: 'freedb_todonikki',
  password: 'kTaR$Z7S83pN#vN',
};

// Create a MySQL connection pool using mysql2
const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
  connection.release(); // Release the connection back to the pool
});

module.exports = { pool, dbConfig };
