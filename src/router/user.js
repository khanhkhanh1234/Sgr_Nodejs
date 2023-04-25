const express = require('express');
const user_router = express.Router();
const connection = require('../database/connection');

user_router.get('/', function (req, res) {
  var user = req.params.id;
connection.query(`select * from users`, [user], function (error, results, fields) {
    // console.log(error);
    // console.log('The solution is: ', results);
    res.json(results);
});
})

user_router.get('/:id', function (req, res) {
    var user = req.params.id;
  connection.query(`select * from users where id = ?`, [user], function (error, results, fields) {
      // console.log(error);
      // console.log('The solution is: ', results);
      res.json(results);
  });
})
user_router.post('/', validateUser, function (req, res) {
    var user = req.body;
    connection.query(`INSERT INTO users (fullname, age) VALUES ('?', '?')`,[user.fullname, user.age], function (error, results, fields) {
        // console.log(error);
        // console.log('The solution is: ', results);
        res.json(results);
    });
})
user_router.put('/:id', validateUser, function (req, res) {
    var user = req.body;
    var id = req.params.id;
    connection.query(`UPDATE users SET fullname = ?, age = ? WHERE id = ?`,[user.fullname, user.age, id], function (error, results, fields) {
        // console.log(error);
        // console.log('The solution is: ', results);
        res.json(results);
    });
})
user_router.delete('/:id', function (req, res) {
    var id = req.params.id;
    connection.query(`DELETE FROM users WHERE id = ?`,[id], function (error, results, fields) {
        // console.log(error);
        // console.log('The solution is: ', results);
        res.json(results);
    });
})
    
// }
function validateUser(req, res, next) {
  var user = req.body;
  var nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
  var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!nameRegex.test(user.name) || user.name.length > 50 || user.age <= 0 || user.password.length < 3 || user.password.length > 50 || !emailRegex.test(user.email) || user.password != user.repassword) {
    res.status(400).json({ message: "Tên người dùng không hợp lệ" });
    return;
  }
  else {
    next();
  }
}

module.exports = {
  user_router,
  validateUser
}
