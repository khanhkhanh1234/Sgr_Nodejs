const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require('./router/user');
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

    app.use('/user', userRoute);
    
// connection.query('SELECT * FROM Item', function (error, results, fields) {
//     console.log(error);
//     console.log('The solution is: ', results);
// });
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});