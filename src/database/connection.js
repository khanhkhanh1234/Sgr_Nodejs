console.log(process.env.DB_HOST)

const mysql = require('mysql');
require('dotenv').config()
connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345',  
    database: 'sgroup',
    multipleStatements: false
}); 

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
  
    console.log('Connected to the database');
})

module.exports = connection;