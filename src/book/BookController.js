const express = require("express");
const router = express.Router();
const slugify = require("slugify");

// - middleware -
const AdminAuth = require("../middlewares/adminAuth.js")

// - service - 
const BookService = require("../services/BookService");

// - routers -
router.get("/book", async (req, res) => {
    let books = await BookService.GetAll();

    res.status(200);
    res.json({books});
});

router.get("/book/:title", async (req, res) => {
    let { title } = req.params;

    let wsTitle = title.toLowerCase();
    let sTitle = slugify(wsTitle);

    let book = await BookService.GetByTitleAndReturnBook(sTitle);
    if(book){
        res.status(200);
        res.json({book});
    } else {
        res.status(404);
        res.json({err: "Titulo não encontrado na base de dados!"})
    };
});

router.post("/book", async (req, res) => {
    let { title, author, price } = req.body;

    if(title && author && price){
        let wsTitle = title.toLowerCase();
        let sTitle = slugify(wsTitle);

        let book = await BookService.GetByTitle(sTitle);
        if(!book){
            let createBook = await BookService.Create(sTitle, author, price);
            if(createBook){
                res.status(200);
                res.json({status: "Livro cadastrado com sucesso!"})
            } else {
                res.status(500);
                res.json({err: "Não foi possivel criar o usuário, tente novamente mais tarde"})
            }
        } else {
            res.status(403);
            res.json({err: "Titulo de livro já cadastrado!"})
        }
    } else {
        res.status(400);
        res.json({err: "Preencha todos os campos!"})
    }

});

router.delete("/book/:title", AdminAuth, async (req, res) => {
    let title = req.params.title

    let wsTitle = title.toLowerCase();
    let sTitle = slugify(wsTitle);

    let book = await BookService.GetByTitle(sTitle);
    if(book){
        let deleteBook = await BookService.DeleteByTitle(sTitle);
        if(deleteBook){
            res.status(200);
            res.json({status: "Livro deletado com sucesso!"});
        } else {
            res.status(500);
            res.json({err: "Não foi possivel deletar o usuário, tende novamente mais tarde!"})
        }
    } else {
        res.status(404);
        res.json({err: "Titulo não encontrado na base de dados!"})
    };
});

router.put("/book/:title", AdminAuth, async (req, res) => {
    let { title } = req.params;
    let { newTitle, newAuthor, newPrice } = req.body;

    let wsTitle = title.toLowerCase();
    let sTitle = slugify(wsTitle);

    let book = await BookService.GetByTitle(sTitle);
    if(book){
        if(newTitle, newAuthor, newPrice){
            let filter = {sTitle};
            let update = {title: newTitle, author: newAuthor, price: newPrice};

            let status = BookService.Update(filter, update);
            if (status){
                res.status(200);
                res.json({status: "Livro atualizado com sucesso!"});
            } else {
                res.status(500);
                res.json({err: "Não foi possivel atualizar o livro, tente novamente mais tarde"});
            }
        } else {
            res.status(400);
            res.json({err: "Preencha de forma válida os campos para a atualização!"});
        };
    } else {
        res.status(404);
        res.json({err: "Livro não encontrado na base de dados!"})
    }

});

module.exports = router;
