const jwt = require("jsonwebtoken");
const express = require("express");
const jwt_decode = require("jwt-decode");
const { user_router, validateUser } = require("../router/user");
const db = require("../database/connection");
const knexDb = require("../database/knexconn");
const crypto = require("crypto");
const fs = require("fs");
const {
  hashPasswordWithSalt,
  hashPasswordWithSaltFromDB,
  encrypt,
  decrypt,
} = require("./security");
const secret = "secret";
const { getOne, create } = require("./query");
const loginRouter = express.Router();
expireTime = 60 * 60 * 24 * 7;
const options = { expiresIn: expireTime };
const publicKey = fs.readFileSync("public_key.pem", "utf8");
const privateKey = fs.readFileSync("private_key.pem", "utf8");
loginRouter.post("/register", validateUser, async (req, res, next) => {
  const { username, password, name, age, gender, email } = req.body;
  const isUserExist = await getOne({
    db,
    query: "SELECT * FROM users WHERE username = ?",
    params: username,
  });

  if (isUserExist) {
    res.json({ message: "Username is already exist" });
  } else {
    const result = await create({
      db,
      query: `INSERT INTO users (username, password, salt, name, age, gender, email)  
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [username, hashedPw, salt, name, age, gender, email],
    });
    res.status(200).json({ message: "Register success" });
  }
});

function addNewUser(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const userToken = authorizationHeader.substring(7);
  //createdBy = jwt_decode(userToken).userId;
  //use to decode jwt get createdBy
  createdBy = 1;
  createdAt = new Date(Date.now());
  if (!createdBy) res.json({ message: "please login" });
  // Add new user
  // username
  // password
  // ..

  const { username, password, email, gender, name, age } = req.body;
  // cfg jwt first

  //   const { salt,
  //     hashPw } = hashPasswordWithSalt(password);
  salt = "abcdxyz";
  //hash functiond doesnt work
  knexDb("users")
    .where("username", username)
    .then((rows) => {
      if (rows.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      } else {
        const userData = {
          username,
          password,
          salt,
          name,
          gender,
          email,
          age,
          createdBy,
          createdAt,
        };
        console.log(userData);
        knexDb("users")
          .insert(userData)
          .then(() => {
            return res
              .status(200)
              .json({ message: "Registration successful", data: userData });
          })
          .catch((error) => {
            throw error;
          });
      }
    })
    .catch((error) => {
      throw error;
    });
}

loginRouter.post("/KnexRegister", addNewUser);

loginRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const isUserValid = await getOne({
    db,
    query: "SELECT * FROM users WHERE username = ?",
    params: username,
  });
  if (!isUserValid) {
    res.status(400).json({ message: "Username not exist" });
  } else {
    const salt = isUserValid.salt;
    const hashedPw = isUserValid.password;
    const hashedPwFromDB = hashPasswordWithSaltFromDB(password, salt).hashedPw;
    console.log({
      hashedPwFromDB,
    });
    if (hashedPwFromDB.localeCompare(hashedPw) === 0) {
      const token = jwt.sign(
        { username: isUserValid.username },
        privateKey,
        { algorithm: "RS256" },
        options
      );
      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: "Username or password is incorrect" });
    }
  }
});
// user_router.put('/:id', validateUser, function (req, res) {
//     var user = req.body;
//     var id = req.params.id;
//     connection.query(`UPDATE users SET fullname = ?, age = ? WHERE id = ?`,[user.fullname, user.age, id], function (error, results, fields) {
//         // console.log(error);
//         // console.log('The solution is: ', results);
//         res.json(results);
//     });
// })

loginRouter.put("/:id", async (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.substring(7);
  console.log(token);
  const { name, age, gender } = req.body;
  var id = req.params.id;
  const isUserValid = await getOne({
    db,
    query: "SELECT username FROM users WHERE id = ?",
    params: id,
  });
  console.log(id);
  try {
    const isTokenValid = jwt.verify(token, publicKey, { algorithm: "RS256" });
    console.log(isTokenValid);
    if (isTokenValid.username.localeCompare(isUserValid.username) === 0) {
      console.log(isTokenValid.username);
      const result = await create({
        db,
        query: `UPDATE users SET name = ?, gender = ?, age = ? WHERE id = ? `,
        params: [name, gender, age, id],
      });
      res.status(200).json({ message: "Update success" });
    } else {
      res.status(400).json({ message: "Username is incorrect" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
function updateUser(req, res, next) {
    const { name, age, gender } = req.body;
    const user_id = req.params.id;
    const userData = {
      gender,
      name,
      age,
    };
  
    knexDb('users')
      .where('id', user_id)
      .update(userData)
      .then(() => {
        res.status(200).json({ message: "Update successful" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
loginRouter.put("/knex/:id",updateUser);

function deleteUser(req, res, next) {
    const user_id = req.params.id;
    knexDb('users')
      .where('id', user_id)
      .del()
      .then((rowCount) => {
        if (rowCount === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
loginRouter.delete("/:id",deleteUser)




module.exports = loginRouter;
