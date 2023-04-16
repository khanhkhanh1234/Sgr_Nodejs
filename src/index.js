const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require('./router/user');
const dotenv = require('dotenv');
const connection = require('./database/connection');
const app = express();
const port = 8080;
app.use(bodyParser.json());
app.use(  
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use('/user', userRoute);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
    console.log(process.env.host);
});