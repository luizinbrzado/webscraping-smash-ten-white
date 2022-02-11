// import Model
const Model = require("../models/model.js");

// DEFINE CONTROLLER FUNCTIONS

//
// listAllTodos function - To list all todos
//

exports.listAllToday = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Model.find({}, (err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(todo);
    });
};




//
// createNewTodo function - To create new todo
//

exports.createNewToday = (req, res) => {
    let newModel = new Model(req.body);
    newModel.save((err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(201).json(todo);
    });
};