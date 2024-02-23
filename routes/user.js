const { Router } = require("express");
const User = require("../models/user");
const {createTokenForUser } = require("../services/authentication");

const router = Router();


router.get("/signIn" ,(req , res) => {
    return res.render("signin");
});

router.get("/signUp" ,(req , res) => {
    return res.render("signUp");
});

router.post('/signin' , async (req , res) => {
    const {email , password} = req.body;
    try{
        const token = await User.matchpasswordandCreateToken(email , password);
        console.log("token" , token);
        return res.redirect("/");
    } catch (error){
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

router.post("/signUp" , async(req , res) => {
    const { fullName , email , password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
});

module.exports = router;