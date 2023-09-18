const mysql = require('mysql2');

const connection = mysql.createConnection({

  host: 'sql.freedb.tech',
  user: 'freedb_nikkiUser',
  database: 'freedb_todonikki',
  password: 'kTaR$Z7S83pN#vN'
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
