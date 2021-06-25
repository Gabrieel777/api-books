const express = require("express");
const app = express();
const mongoose = require("mongoose");

const UserController = require("./user/UserController");
const BookController = require("./book/BookController");

// - mongoose -
mongoose.connect("mongodb://localhost:27017/guiapics", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useFindAndModify", false);

// - bodyParser -
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// - controllers -

app.use("/", UserController);

app.use("/", BookController);


// - routers - 

app.get("/", (req, res) => {
    res.json({});
});

module.exports = app;