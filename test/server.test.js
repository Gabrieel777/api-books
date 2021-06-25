const app = require("../src/app");
const supertest = require("supertest");

const request = supertest(app);


test("A aplicação deve responder na porta 3131", () => {

    return request.get("/").then(res => {
        const status = res.statusCode;
        expect(status).toEqual(200);
    }).catch(err => {
        fail(err);
    });

});