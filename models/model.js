'use strict';

const now = new Date();
now.setUTCMilliseconds(-3600 * 1000 * 3);

// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const resultadoSchema = new Schema({
    time: {
        type: String,
        required: true
    },
    result: {
        type: Array,
        required: true
    }
});

// create and export model
module.exports = mongoose.model(`SequenceTen`, resultadoSchema);