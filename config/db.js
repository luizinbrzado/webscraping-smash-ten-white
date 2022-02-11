// Export mongoose
const mongoose = require("mongoose");

//Assign MongoDB connection string to Uri and declare options settings
var uri = `mongodb+srv://webcrepe:${process.env.SENHA}@webscraperblaze.regju.mongodb.net/SmashDoubleSequenceArray?retryWrites=true&w=majority`;

// Declare a variable named option and assign optional settings
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Connect MongoDB Atlas using mongoose connect method
mongoose.connect(uri, options).then(() => {
    console.log("Conexão com o DB top!");
},
    err => {
        {
            console.log("Error connecting Database instance due to:", err);
        }
    });