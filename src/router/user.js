const express = require('express');
const user_router = express.Router();
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
user_router.get('/', function (req, res) {
    res.json(object);
})
user_router.get('/:id', function (req, res) {
    res.json(object[req.params.id]);  
})
user_router.post('/', function (req, res) {
    req.body.id = ++count;
    object.push(req.body);
    res.status(201).json(object);
})
user_router.put('/:id', function (req, res) {
    object[req.params.id] = req.body;
    req.body.id = object.length-1;
    res.status(204).json(object);
})
user_router.delete('/:id', function (req, res) {
    object.splice(req.params.id, 1);
    for (let i = 0; i < object.length; i++) {
        object[i].id = i;
    }
    res.status(204).json(object);
})
module.exports = user_router;