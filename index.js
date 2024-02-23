const path = require("path");
const express = require("express");
const mongoose = require("mongoose");


const UserRoute = require("./routes/user");

const app = express();
const PORT = 8005;

// mongoDb connected 

mongoose.connect("mongodb://127.0.0.1:27017/blogify").then((e) => console.log("Monogdb connceted"));


// set the view engine for the ejs 
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));

// SET UP FOR T HE IDDLE WARE FOR HANNDLE THE FORM 
app.use(express.urlencoded({extended: false}));

app.get("/" , function(req ,res){
    res.render('home');
})

app.use("/user" , UserRoute);


app.listen(PORT , () => console.log(`server is started at PORT : ${PORT}`));