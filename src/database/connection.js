const mysql = require('mysql');
connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',  
    database: 'sgr_nodejs1'}); 

    module.exports = connection;