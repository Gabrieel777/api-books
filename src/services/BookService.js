const mongoose = require("mongoose");
const bookModel = require("../models/Book");

const Book = mongoose.model("Book", bookModel);

class BookService {

    async Create(title, author, price){


        const newBook = new Book({
            title,
            author,
            price
        });

        try {
            await newBook.save();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        };

    };

    async GetAll(){
        try {
            let books = await Book.find();
            return books;
        } catch(err) {
            return console.log(err);
        }
    };

    async GetByTitle(title){
        try {
            const book = await Book.findOne({title});
            if(book != undefined){
                return true;
            } else {
                return false;
            }
        } catch(err) {  
            console.log(err);
            return false;
        }
    };

    async GetByTitleAndReturnBook(title){
        try {
            const book = await Book.findOne({title});
            if(book != undefined){
                return book;
            } else {
                return false;
            }
        } catch(err) {  
            console.log(err);
            return false;
        }
    }

    async DeleteByTitle(title){
        try{
            await Book.deleteOne({title});
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    };

    async Update(filter, update){
        try{
            await Book.findOneAndUpdate(filter, update);
            return true;
        } catch(err) {
            console.log(err);
            return false;
        };
    };

};

module.exports = new BookService();