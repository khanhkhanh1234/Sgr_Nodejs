const jwt = require('jsonwebtoken');
const express = require('express');
const secret = 'secret';
const loginRouter = express.Router();
const user  =[{
    id: 1,
    username: 'admin',
    password: 'admin',
    org : 'sgr'
},
{
    id: 2,
    username: 'user',
    password: 'user',
    org : 'sgr'
}
];
loginRouter.post('/login', (req, res) => {
    const { username, password } = req.body;    
    const check = user.find(u => { return u.username === username && u.password === password });
    if (check) {
        const token = jwt.sign({ username: user.username }, secret);
        res.status(200).json({ token });
        console.log(token);
       
        // localStorage.setItem('token', token);
    }
    else {
        res.status(400).json({ message: 'Username or password is incorrect' });
    }
});

loginRouter.get('/balance', (req, res, next) => { 
    const authorization = req.headers.authorization;
    const token = authorization.substring(7);
    const username = req.query.username;
    try {
        const isTokenValid = jwt.verify(token, secret);
        if (isTokenValid) {
            const check = user.find(u => { return u.username === username });
            if (check) {
                res.status(200).json({ balance: 100000 });
            }
            else {
                res.status(400).json({ message: 'Username is incorrect' });
            }
        }
    }
    catch (err) {
        res.status(400).json({ message: 'Error' });
    }
    
});


module.exports = loginRouter;
// const token = jwt.sign(user, secret);
// console.log(token);
// const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsIm9yZyI6InNnciIsImlhdCI6MTY4MTczNTQ2NX0.DNLgkVrLlgYYhN9PWtF3ydtwWigUt-b1UZiOU5vzFtM"
// const isTokenValid = jwt.verify(userToken, secret);
// console.log(isTokenValid);