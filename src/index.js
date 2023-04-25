const express = require('express');
const bodyParser = require('body-parser');
const {user_router} = require('./router/user');
const loginRouter = require('./variables/auth');
const loginRouter2 = require('./variables/testprivatekey');
const dotenv = require('dotenv').config();
const connection = require('./database/connection');
const crypto = require('crypto');
console.log(process.env.host);
const app = express();
const port = 8080;
app.use(bodyParser.json());
app.use(  
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use('/user', user_router);
app.use('/auth', loginRouter);
app.use('/auth2', loginRouter2);
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
   
});