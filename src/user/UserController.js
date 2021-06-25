const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWTSecret = "ljasdlsadjadsa"

//const AdminAuth = require("../middlewares/adminAuth.js")

const UserService = require("../services/UserService");

router.get("/user", async (req, res) => {
    let users = await UserService.GetAll();
    res.status(200);
    res.json({users});
});

router.get("/user/:email", async (req, res) => {
    let { email } = req.params;

    let user = await UserService.GetByEmailAndReturnResult(email);
    if(user){
        res.status(200);
        res.json({user});
    } else {
        res.status(404);
        res.json({err: "Usuário não encontrado na base de dados!"})
    };

});


router.post("/user", async (req, res) => {
    let { name, email, password } = req.body;
    
    let re = /\S+@\S+\.\S+/;
    let validateEmail = re.test(email);

    if(validateEmail && name && password){

        let user = await UserService.GetByEmail(email);

        if(!user){
            let statusCreate = await UserService.Create(name, email, password);

            if(statusCreate){
                res.status(200);
                res.json({email});  
            } else {
                res.status(500);
                res.json({err: "Não foi possivel criar o usuário, tente novamente mais tarde"});
            }
            
        } else {
            res.status(403)
            res.json({err: "Email já cadastrado!"});

        }

    } else {
        res.status(400)
        res.json({err: "Preencha todos os campos!"});
 
    }


});

router.post("/auth", async (req, res) => {
    let { email, password } = req.body;

    let re = /\S+@\S+\.\S+/;
    let validateEmail = re.test(email);

    if(validateEmail && password){
        let user = await UserService.GetByEmailAndReturnResult(email);
        if(user){
            var correct = await bcrypt.compareSync(password,user.password);
            if(correct){
                jwt.sign({email, name: user.name, id: user._id}, JWTSecret, {expiresIn:"48h"}, (err, token) => {
                    if(err){
                        console.log(err);
                    } else {
                        res.status(200);
                        res.json({token});
                    };
                });
            } else {
                res.status(400);
                res.json({err: "Senha incorreta!"})
            }
        } else {
            res.status(404);
            res.json({err: "Usuário não encontrado na base de dados!"})
        }
    } else {
        res.status(400);
        res.json({err: "Preencha todos os campo de forma valida!"})
    }

});

router.put("/user/:email", AdminAuth, async (req, res) => {
    let { email, password } = req.body.login;
    let { newName, newEmail } = req.body.update;

    let re = /\S+@\S+\.\S+/;
    let validateEmail = re.test(email);

    if(validateEmail && password){
        let user = await UserService.GetByEmailAndReturnResult(email);
        if(user){
            var correct = bcrypt.compareSync(password, user.password)
            if(correct){
                let validateNewEmail = re.test(newEmail);
                if(validateNewEmail && newName ){
                    let filter = {email};
                    let update = {name: newName, email: newEmail};

                    let status = await UserService.Update(filter, update);
                    if(status){
                        res.status(200);
                        res.json({status: "Usuário atualizado com sucesso!"});
                    } else {
                        res.status(500);
                        res.json({err: "Não foi possivel criar o usuário, tente novamente mais tarde"});
                    }
                } else {
                    res.status(400);
                    res.json({err: "Preencha os campos de forma valida para a atualização dos dados!"})
                }
            } else {
                res.status(400);
                res.json({err: "Senha incorreta!"});
            }
        } else {
            res.status(404)
            res.json({err: "Usuário não encontrado na base de dados!"});
        }
    } else {
        res.status(400);
        res.json({err: "Preencha todos os campo para login de forma valida!"});
    }

});

router.delete("/user/:email", AdminAuth, async (req, res) => {
    let { email } = req.params;

    let re = /\S+@\S+\.\S+/;
    let validateEmail = re.test(email);

    if(validateEmail){
        let user = await UserService.GetByEmail(email);
        if(user){
            let userIsDelete = UserService.Delete(email);
            if(userIsDelete){
                res.sendStatus(200);
            } else {
                res.status(500);
                res.json({err: "Não foi possivel deletar o usuário, tende novamente mais tarde!"})
            }
        } else {
            res.status(404);
            res.json({err: "Usuário não encontrado na base de dados!"})
        }
    } else {
        res.status(400);
        res.json({err: "Email inválido!"})
    }   


});


module.exports = router;