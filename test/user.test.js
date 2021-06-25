const app = require("../src/app");
const supertest = require("supertest");

const request = supertest(app);


let mainUser = {name: "Gabriel", email:"gabriel@email.com", password: "123456"};

beforeAll(async () => {
    try {
        await request.post("/user").send(mainUser);
        return;
    } catch (err) {
        return console.log(err);
    }
});

afterAll(async () => {
    try {
        await request.delete(`/user/${mainUser.email}`)
        return;
    } catch (err) {
        console.log(err);
    }
});

describe("Exibir os usuários", () => {
    test("Devera exibir uma lista de usuários", () => {
        return request.get("/user")
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.users).toBeDefined();
        }).catch(err => fail(err));
    });

    test("Deve exibir um usuário de acordo com o titulo passado por parametro", () => {
        return request.get(`/user/gabriel@email.com`)
        .then(res => {
            expect(res.statusCode).toEqual(200);
        }).catch(err => fail(err));
    });

    test("Deve impedir que exiba um usuario cujo o email é inexistente na base de dados", () => {
        return request.get(`/user/emailnotexist`)
        .then(res => {
            expect(res.statusCode).toEqual(404);
            expect(res.body.err).toEqual("Usuário não encontrado na base de dados!");
        }).catch(err => fail(err));
    });
});

describe("Cadastro de usuário", () => {
    test("Deve cadastrar um usuário com sucesso", () => {

        let time = Date.now();
        let email = `${time}@company.com`;

        let user = {name: "Gabriel", email, password: "123456"};

        return request.post("/user").send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);
        }).catch(err => {
            fail(err);
        });

    });
    
    test("Deve imperdir que um usuário se cadastre com os dados vazios", () => {
        let user = {name: "", email: "", password: ""};

        return request.post("/user").send(user)
        .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.err).toEqual("Preencha todos os campos!")
        }).catch(err => {
            fail(err);
        });
    });

    test("Deve impedir que um usuário se cadastre com email repetido", () => {

        let time = Date.now();
        let email = `${time}@company.com`;

        let user = {name: "Gabriel", email, password: "123456"};

        return request.post("/user").send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            return request.post("/user").send(user)
            .then(res => {
                expect(res.statusCode).toEqual(403);
                expect(res.body.err).toEqual("Email já cadastrado!");
            })
            .catch(err => {
                fail(err);
            });
        }).catch(err => {
            fail(err);
        });

    });
});

describe("Deleção de usuário", () => {
    test("Deve deletar um usuário com sucesso", () => {

        let time = Date.now();
        let email = `${time}@company.com`;

        let user = {name: "Gabriel", email, password: "123456"};

        return request.post("/user").send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            return request.delete(`/user/${email}`)
            .then(res => {
                expect(res.statusCode).toEqual(200);
            }).catch(err => {
                fail(err);
            });

        }).catch(err => {
            fail(err);
        });

    });

    test("Deve impedir que o usuário faça uma requisição um email invalido", () => {

        let email = "exemploemail";

        return request.delete(`/user/${email}`)
        .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.err).toEqual("Email inválido!");
        }).catch(err => fail(err));

    });

    test("Deve impedir que o usuário faça uma requisição com um email não cadastrado", () => {

        let time = Date.now();
        let email = `${time}@company.com`;

        return request.delete(`/user/${email}`)
        .then(res => {
            expect(res.statusCode).toEqual(404);
            expect(res.body.err).toEqual("Usuário não encontrado na base de dados!");
        }).catch(err => fail(err));

    })

});

describe("Atualizar usuário", () => {
    test("Deve atualizar o usuário com sucesso", () => {
        let time = Date.now();
        let email = `${time}@company.com`;

        return request.post("/user")
        .send({name: "Gabriel", email, password:"123456"})
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            let newTime = Date.now();
            let newEmail = `${newTime}@company.com`;

            let login = {email, password: "123456"};
            let update = {newName: "Julian", newEmail}

            return request.put(`/user/${email}`)
            .send({login, update})
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.status).toEqual("Usuário atualizado com sucesso!");
            })
            .catch(err => fail(err));
        })
        .catch(err => fail(err));
    });

    test("Deve impedir que o usuário faça atualização com campos de login inválidos", () => {
        let time = Date.now();
        let email = `${time}@company.com`;

        return request.post("/user")
        .send({name: "Gabriel", email, password:"123456"})
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            let newTime = Date.now();
            let newEmail = `${newTime}@company.com`;

            let login = {email: "aracaju.com"};
            let update = {newName: "Julian", newEmail}

            return request.put(`/user/${email}`)
            .send({login, update})
            .then(res => {
                expect(res.statusCode).toEqual(400);
                expect(res.body.err).toEqual("Preencha todos os campo para login de forma valida!");
            })
            .catch(err => fail(err));
        })
        .catch(err => fail(err));
    });

    test("Deve impedir que o usuário faça o login para atualização com um email não existente na base de dados", () => {
        let exampleUser = {name: "ExampleUser", email: "example@email.com", password: "123456"};

        let login = {email: exampleUser.email, password: exampleUser.password};
        let update = {name: "newExampleUser", email: "user@example.com"};
        return request.put(`/user/${exampleUser.email}`)
        .send({login, update})
        .then(res => {
            expect(res.statusCode).toEqual(404);
            expect(res.body.err).toEqual("Usuário não encontrado na base de dados!");
        }).catch(err => fail(err));
    });

    test("Deve impedir que o usuário faça login para atualização com a senha incorreta", () => {
        let login = {email: mainUser.email, password: "isAnotPassword"};
        let update = {newName: "exampleName", newEmail: "example@examplee.com"};

        return request.put(`/user/${mainUser.email}`)
        .send({login, update})
        .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.err).toEqual("Senha incorreta!")
        }).catch(err => fail(err));

    });

    test("Deve impedir que o usuário faça atualização com dados indefinidos", () => {
        let login = {email: mainUser.email, password: "123456"};
        let update = {newName: "", newEmail: ""};

        return request.put(`/user/${mainUser.email}`)
        .send({login, update})
        .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.err).toEqual("Preencha os campos de forma valida para a atualização dos dados!")
        }).catch(err => fail(err));

    });
});

describe("Autenticação", () => {
    test("Deve retornar um token quando o usuário logar", () => {

        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        })
        .catch(err => fail(err));
    });

    test("Deve impedir que o usuário faça autenticação com campos indefinidos", () => {
        let ExampleUser = {email: "", password: ""};

        return request.post("/auth")
        .send({email: ExampleUser.email, password: ExampleUser.password})
        .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.err).toEqual("Preencha todos os campo de forma valida!");
        }).catch(err => fail(err));


    });

    test("Deve impedir que o usuário faça autenticação com um email não existente na base de dados", ()=> {
        let ExampleUser = {email: "user@example.com", password: "123465"};
        
        return request.post("/auth")
        .send({email: ExampleUser.email, password: ExampleUser.password})
        .then(res => {
            expect(res.statusCode).toEqual(404);
            expect(res.body.err).toEqual("Usuário não encontrado na base de dados!");
        })
        .catch(err => fail(err));
    });

    test("Deve impedir que o usuário faça autenticação com a senha incorreta", () => {
        let time = Date.now();
        let email = `${time}@company.com`;

        let user = {name: "Gabriel", email, password: "correctPassword"};

        return request.post("/user").send({name: user.name, email: user.email, password: user.password})
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            return request.post("/auth")
            .send({email: user.email, password: "IncorrectPassword"})
            .then(res => {
                expect(res.statusCode).toEqual(400);
                expect(res.body.err).toEqual("Senha incorreta!");
            }).catch(err => fail(err));
        })
        .catch(err => {
            fail(err);
        })
    });
}); 

