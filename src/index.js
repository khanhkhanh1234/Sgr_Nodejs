// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const port = 8080;
// object = [
// 	{
//         id: null,
// 		"fullname": "Nguyen Huy Tuong",
// 		"gender": true,
// 		"age": 18
// 	},
// 	{
//         id: null,
// 		"fullname": "Nguyen Thi Tuong",
// 		"gender": false,
// 		"age": 15
// 	}
// ]
// app.use(bodyParser.json());
// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     }),
// );
// app.use(express.json());
// app.get('/user', function (req, res) {
//     object.id = object.length;
//     res.json(object);
//   })
//   app.get('/user/:id', function (req, res) {
//     res.json(object[req.params.id]);  
//     console.log(req.params.id);
//   })
//   app.post('/user', function (req, res) {
//     req.body.id = object.length;
//     object.push(req.body);
//     res.status(201).json(object);
//   })
//     app.put('/user/:id', function (req, res) {
//         object[req.params.id] = req.body;
//         req.body.id = object.length-1;
//         res.status(204).json(object);
//     })
//     app.delete('/user/:id', function (req, res) {
//         object.splice(req.params.id,1);
//         res.status(204).json(object);
//         console.log(req.params.id);
//     })
// app.listen(port, () => {
//     console.log(`app listening on port ${port}`);
// });
// //.query
// //.body
// //.params
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
let count = -1;
const object = [
	{
		id: ++count,
		"fullname": "Nguyen Huy Tuong",
		"gender": true,
		"age": 18
	},
	{
		id: ++count,
		"fullname": "Nguyen Thi Tuong",
		"gender": false,
		"age": 15
	}
]
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.get('/user', function (req, res) {
    res.json(object);
})
app.get('/user/:id', function (req, res) {
    res.json(object[req.params.id]);  
})
app.post('/user', function (req, res) {
    req.body.id = ++count;
    object.push(req.body);
    res.status(201).json(object);
})
app.put('/user/:id', function (req, res) {
    object[req.params.id] = req.body;
    req.body.id = object.length-1;
    res.status(204).json(object);
})
app.delete('/user/:id', function (req, res) {
    object.splice(req.params.id, 1);
    for (let i = 0; i < object.length; i++) {
        object[i].id = i;
    }
    res.status(204).json(object);
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
