const knex = require('knex');
//em khong dung bien .env vi may em bi loi, ban khac clone project cua em ve thi chay duoc

const db = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '1234a@',
    database: 'Khanh',
  },
  pool :{min:0,max:10}
});
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((error) => {
    console.log('Error connecting to the database:', error);
  });

module.exports = db;