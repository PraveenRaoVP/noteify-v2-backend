const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth")

const router = new express.Router();

//Create new user
router.post("/users/create", async(req,res) => {
    const user = new User(req.body);

    try{
        await user.save();
        const token = await user.generateAuthToken()

        res.status(201).send({user, token, message: "New account created"});
    } catch(e) {
        console.log("Error")
        if(user.password.length < 8) {
            res.status(500).send({message: "Password needs to be more than 8 characters"})
        } else if(e.keyPattern.userName == 1){
            res.status.send({message: "Username already exists."})
        } else{
            res.status(500).send({message: "Something went wrong. Try again."});
        }
    }
});

//Login users
router.post('/users/login', async(req,res) => {
    try{
        const user = await User.findTheUser(req.body.userName, req.body.password);
        const token = await User.generateAuthToken();

        res.status(200).send({user,token});
    } catch(e) {
        res.status(500).send({message: "Unable to login"});
    }
});

//logout user
router.post('/users/logout', auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send({message: "Logged out"})
    } catch{
        res.status(500).send(e)
    }
});

//get user details
router.get("/users/me", auth, async(req,res) => {
    res.send(req.user);
});

// delete user
router.delete("/users/delete",auth, async(req,res) =>{
    try{
        req.user.remove();
        res.send({message: "User account deleted with all data"})
    } catch(e) {
        res.status(500).send(e);
    }
});

module.exports = router;