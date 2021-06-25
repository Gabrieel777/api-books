const app = require("../src/app");
const supertest = require("supertest");

const request = supertest(app);

const exBook = {title: "exBook Success", author: "Rafael Jualian", price: 300};

beforeAll(async () => {
    try {
        await request.post("/book").send(exBook); 
        return;  
    } catch(err) {
        return console.log(err);
    };
});

afterAll(async () => {
    try{
        await request.delete(`/book/${exBook.title}`);
        return;
    } catch(err) {
        return console.log(err);
    };
});

describe("Exibir os livros", () => {
    test("Deve exibir uma lista com todos os livros", () => {
        return request.get("/book")
        .then(res => {
            expect(res.statusCode).toEqual(200);
        }).catch(err => fail(err));
    });

    test("Deve exibir um livro de acordo com o titulo passado por parametro", () => {
        return request.get(`/book/exbook-success`)
        .then(res => {
            expect(res.statusCode).toEqual(200);
        }).catch(err => fail(err));
    });

    test("Deve impedir que exiba um livro cujo o titulo é inexistente na base de dados", () => {
        return request.get(`/book/titlethatdoesn'texist000000`)
        .then(res => {
            expect(res.statusCode).toEqual(404);
            expect(res.body.err).toEqual("Titulo não encontrado na base de dados!");
        }).catch(err => fail(err));
    });
});

describe("Cadastro de livros", () => {
    test("Devera cadastrar um livro com sucesso", () => {
        let time = Date.now();
        let title = `${time}`

        let book =  {title, author: "Example Author", price: 100};

        return request.post("/book")
        .send(book)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual("Livro cadastrado com sucesso!");
        }).catch(err => fail(err));

    });

    test("Deve impedir que um usuário cadastre um livro os dados inválidos", () => {
        let book = {title: "", author: "", price: ""};

        return request.post("/book")
        .send(book)
        .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.err).toEqual("Preencha todos os campos!")
        }).catch(err => fail(err));
    });

    test("Deve impedir que um usuário cadastre um livro com um titulo já existente", () => {
        let book = {title: "exBook Success", author: "Aristides Girardi", price: 250};

        return request.post("/book")
        .send(book)
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.err).toEqual("Titulo de livro já cadastrado!");
        }).catch(err => fail(err));
        
    });
});

describe("Deleção de livros", () => {
    test("Deve deletar um livro com sucesso", () => {
        let time = Date.now();
        let title = `${time}`;

        let book = {title, author: "Example Author", price: 140};

        return request.post("/book")
        .send(book)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual("Livro cadastrado com sucesso!");

            return request.delete(`/book/${title}`)
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.status).toEqual("Livro deletado com sucesso!");
            }).catch(err => fail(err));
        }).catch(err => fail(err));
    }); 

    test("Deve imperdir que o usuário delete um titulo inexistente na base de dados", () => {
        let book = {title: "titlenotexistindb"};

        return request.delete(`/book/${book.title}`)
        .then(res => {
            expect(res.statusCode).toEqual(404);
            expect(res.body.err).toEqual("Titulo não encontrado na base de dados!");
        }).catch(err => fail(err))
    });

});

describe("Atualicação de livros", () => {
    test("Deve atualizar um livro com sucesso", () => {
        let time = Date.now();
        let title = `${time}`;

        let book = {title, author: "Example author", price: 150};

        return request.post("/book")
        .send(book)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual("Livro cadastrado com sucesso!");

            let newTime = Date.now();
            let newTitle = `${newTime}`;

            let newBook = {newTitle, newAuthor: "newAuthor", newPrice: 200}
            return request.put(`/book/${title}`)
            .send(newBook)
            .then(res =>{
                expect(res.statusCode).toEqual(200);
                expect(res.body.status).toEqual("Livro atualizado com sucesso!");
            }).catch(err => fail(err));
        }).catch(err => fail(err));
    });

    test("Deve impedir que o usuário atualize um livro com o titulo não existente na base de dados", () => {
        let book = {title: "title undefined in the database"};

        let newBook = {newTitle: "new Title for the book", newAuthor: "new author", newPrice: 999};

        return request.put(`/book/${book.title}`)
        .send(newBook)
        .then(res => {
            expect(res.statusCode).toEqual(404);
            expect(res.body.err).toEqual("Livro não encontrado na base de dados!");
        }).catch(err => fail(err));

    });

    test("Deve impedir que o usuário atualize um livro com dados inválidos", () => {
        let upBook = {newTitle: "", newAuthor: "", newPirce: ""};

        return request.put(`/book/${exBook.title}`)
        .send(upBook)
        .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.err).toEqual("Preencha de forma válida os campos para a atualização!");
        }).catch(err => fail(err));
    });
});