console.log(process.env.DB_HOST)

const mysql = require('mysql');
require('dotenv').config()
connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',  
    database: 'sgr_nodejs1',
    multipleStatements: false
}); 

module.exports = connection;
console.log(process.env.host);