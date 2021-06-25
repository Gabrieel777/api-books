const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("../models/User");

const User = mongoose.model("User", userModel);

class UserService {

    async Create(name, email, password){

        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
            name,
            email,
            password: hash
        });

        try {
            await newUser.save();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        };

    };

    async GetAll(){
        try {
            const users = await User.find();
            return users;
        } catch (err) {
            console.log(err);
        };
    };

    async GetByEmail(email){
        try {
            const user = await User.findOne({"email": email});
            if(user != null){
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        };
    };

    async GetByEmailAndReturnResult(email){
        try {
            const user = await User.findOne({"email": email});
            if(user != null){
                return user;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        };
    };

    async Delete(email){
        try {
            await User.deleteOne({"email": email});
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    async Update(filter, update){
        try {
            await User.findOneAndUpdate(filter, update);
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    }
}

module.exports = new UserService();