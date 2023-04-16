const connection = require('./connection');
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    age INT(11) NOT NULL,
    PRIMARY KEY (id)
  )
`;
connection.query(createTableQuery, function (error, results, fields) {
    console.log(error);
    console.log('The solution is: ', results);
});