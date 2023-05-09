const jwt = require('jsonwebtoken');
const express = require('express');
const {user_router,
    validateUser}
     = require('../router/user');
const db = require('../database/connection');
const crypto = require('crypto');
const fs = require('fs');
const { hashPasswordWithSalt, hashPasswordWithSaltFromDB, encrypt, decrypt } = require('./security');
const secret = 'secret';
const { getOne, create } = require('./query');
const loginRouter = express.Router();
expireTime = 60 * 60 * 24 * 7;
const options = { expiresIn: expireTime };
// const {
//     publicKey,
//     privateKey,
// } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
// const keyPair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
// const publicKey = keyPair.publicKey.export({type: 'pkcs1', format: 'pem'});

// // Lưu khóa công khai vào file public_key.pem
// fs.writeFileSync('public_key.pem', Buffer.from(publicKey).toString('utf8'));
// const privateKey = keyPair.privateKey.export({type: 'pkcs1', format: 'pem'});
// // Lưu khóa riêng tư vào file private_key.pem
// fs.writeFileSync('private_key.pem', Buffer.from(privateKey).toString('utf8'));
const publicKey = fs.readFileSync('public_key.pem', 'utf8');
const privateKey = fs.readFileSync('private_key.pem', 'utf8');
loginRouter.post('/register', validateUser, async (req, res, next) => {
    const { username, password, name, age, gender, email } = req.body;
    const isUserExist = await getOne({
        db,
        query: "SELECT * FROM users WHERE username = ?",
        params: username,
    });
    if (isUserExist) {
        res.json({ message: 'Username is already exist' });
    } else {

        const { salt,
            hashedPw } = hashPasswordWithSalt(password);
        const result = await create({
            db,
            query: `INSERT INTO users (username, password, salt, name, age, gender, email)  
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
            params: [username, hashedPw, salt, name, age, gender, email]
        });
        res.status(200).json({ message: 'Register success' });
    }
});

loginRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const isUserValid = await getOne({
        db,
        query: "SELECT * FROM users WHERE username = ?",
        params: username,
    });
    if (!isUserValid) {
        res.status(400).json({ message: 'Username not exist' });
    } else {
        const salt = isUserValid.salt;
        const hashedPw = isUserValid.password;
        const hashedPwFromDB = hashPasswordWithSaltFromDB(password, salt).hashedPw;
        console.log({
            hashedPwFromDB,
        });
        if (hashedPwFromDB.localeCompare(hashedPw) === 0) {
            const token = jwt.sign({ username: isUserValid.username }, privateKey, { algorithm: 'RS256' }, options) ;
            res.status(200).json({ token });
        }
        else {
            res.status(400).json({ message: 'Username or password is incorrect' });
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

loginRouter.put('/:id', async (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization.substring(7);
    console.log(token);
    const {
        name,
        age,
        gender
    } = req.body;
    var id = req.params.id;
    const isUserValid = await getOne({
        db,
        query: "SELECT username FROM users WHERE id = ?",
        params: id,
    });
    console.log(id);
    try {
        const isTokenValid = jwt.verify(token, publicKey, { algorithm: 'RS256' });
        console.log(isTokenValid);
        if (isTokenValid.username.localeCompare(isUserValid.username) === 0) {
            console.log(isTokenValid.username);
            const result = await create({
                db,
                query: `UPDATE users SET name = ?, gender = ?, age = ? WHERE id = ? `,
                params: [name, gender, age, id]
            });
            res.status(200).json({ message: 'Update success' });
            }
            else {
                res.status(400).json({ message: 'Username is incorrect' });
            }
        
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }

});


module.exports = loginRouter;

