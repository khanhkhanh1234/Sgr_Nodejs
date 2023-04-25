const jwt = require('jsonwebtoken');
const express = require('express');
const user_router = require('../router/user');
const db = require('../database/connection');
const crypto = require('crypto');
const { hashPasswordWithSalt, hashPasswordWithSaltFromDB, encrypt, decrypt } = require('./security');
const secret = 'secret';
const { getOne, create } = require('./query');
const loginRouter = express.Router();
const {
    publicKey,
    privateKey,
} = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
loginRouter.post('/register', user_router.validateUser, async (req, res, next) => {
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
            const token = jwt.sign({ username: isUserValid.username }, privateKey, { algorithm: 'RS256' });
            res.status(200).json({ token });
        }
        else {
            res.status(400).json({ message: 'Username or password is incorrect' });
        }
    }
});


loginRouter.get('/update', (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization.substring(7);
    // console.log(token);
    const username = req.query.username;
    const decoded = jwt.verify(token, publicKey, { algorithm: 'RS256' });
        console.log(decoded);
    try {
        const isTokenValid = jwt.verify(token, publicKey, { algorithm: 'RS256' });
        console.log(isTokenValid);
        if (isTokenValid) {
            const check = isTokenValid.username.localeCompare(username) === 0;
            if (check) {
                res.status(200).json({ balance: 100000 });
            }
            else {
                res.status(400).json({ message: 'Username is incorrect' });
            }
        }
    }
    catch (err) {
        res.status(400).json({ message: 'Authorization Failed' });
    }

});


module.exports = loginRouter;

