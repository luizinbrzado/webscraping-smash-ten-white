'use strict';

// create App function
module.exports = function (app) {
    var resultados = require('../controllers/resultadoController');

    // todoList Routes

    // get and post request for /todos endpoints

    app
        .route("")
        .get(resultados.listAllToday)
        .post(resultados.createNewToday);
};