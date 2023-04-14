const express = require('express');
const user_router = express.Router();
const connection = require('../database/connection');
// const insertDataQuery = `
//   INSERT INTO users (fullname, age)
//   VALUES ('Nguyen', 30),
//          ('Huy', 25),
//          ('Tuong', 40)
// `;
// connection.query(insertDataQuery, function (error, results, fields) {
//   console.log(error);
//   console.log('The solution is: ', results);
// });
user_router.get('/', function (req, res) {
  connection.query('select * from users', function (error, results, fields) {
    // console.log(error);
    // console.log('The solution is: ', results);
    res.json(results);
});

})
user_router.get('/:id', function (req, res) {
    var user = req.params.id;
  connection.query(`select * from users where id =${user}`, function (error, results, fields) {
      // console.log(error);
      // console.log('The solution is: ', results);
      res.json(results);
  });
})
user_router.post('/', validateUser, function (req, res) {
    var user = req.body;
    connection.query(`INSERT INTO users (fullname, age) VALUES ('${user.fullname}', ${user.age})`, function (error, results, fields) {
        // console.log(error);
        // console.log('The solution is: ', results);
        res.json(results);
    });
})
user_router.put('/:id', validateUser, function (req, res) {
    var user = req.body;
    var id = req.params.id;
    connection.query(`UPDATE users SET fullname = '${user.fullname}', age = ${user.age} WHERE id = ${id}`, function (error, results, fields) {
        // console.log(error);
        // console.log('The solution is: ', results);
        res.json(results);
    });
})
user_router.delete('/:id', function (req, res) {
    var id = req.params.id;
    connection.query(`DELETE FROM users WHERE id = ${id}`, function (error, results, fields) {
        // console.log(error);
        // console.log('The solution is: ', results);
        res.json(results);
    });
})
// function validateUser(req, res, next) {
//     var user = req.body;
//     if (!/[^0123456789\s]/.test(user.fullname) || user.fullname.length < 6 ||user.age <= 0) {
//         res.status(400).json({ message: "fullname is invalid" });
//         return;
//     }
//     else {
//         next();
//     }
    
// }
function validateUser(req, res, next) {
  var user = req.body;
  var nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
  
  if (!nameRegex.test(user.fullname) || user.fullname.length < 6 || user.fullname.length > 50 || user.age <= 0) {
    res.status(400).json({ message: "Tên người dùng không hợp lệ" });
    return;
  }
  else {
    next();
  }
}


module.exports = user_router;