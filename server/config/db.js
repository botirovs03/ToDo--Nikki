const mysql = require('mysql2');
const knex = require('knex');

// Define your database connection configuration in a single object
const dbConfig = {
  host: 'sql.freedb.tech',
  user: 'freedb_nikkiUser',
  database: 'freedb_todonikki',
  password: 'kTaR$Z7S83pN#vN',
};

// Create a MySQL connection using mysql2
const connection = mysql.createConnection(dbConfig);





connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = { connection, dbConfig };
