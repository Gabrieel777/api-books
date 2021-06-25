const mongoose = require("mongoose");

const bookModel = new mongoose.Schema({
    title: String,
    author: String,
    price: Number
});

module.exports = bookModel;