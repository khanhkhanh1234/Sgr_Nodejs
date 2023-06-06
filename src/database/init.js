const connection = require('./connection');
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender BOOLEAN NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INT(11) NOT NULL,
    PRIMARY KEY (id)
    unique (username)
  )
`;


//ALTER TABLE users     ADD COLUMN createdBy     INT,   	 ADD CONSTRAINT fk_createdBy     FOREIGN KEY (createdBy) REFERENCES users(id);

//ALTER TABLE users      add column createdAt DATE;

connection.query(createTableQuery, function (error, results, fields) {
    console.log(error);
    console.log('The solution is: ', results);
});