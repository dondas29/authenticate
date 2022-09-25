//jshint esversion:6
require("dotenv").config()
const express=require("express")
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const encrypt=require("mongoose-encryption")
const ejs=require("ejs")
const app=express()
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine",'ejs')

mongoose.connect('mongodb://localhost:27017/usersDB');

const userschema=mongoose.Schema({
    username:String,
    password:String
})

userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})

const usermodel=mongoose.model("user",userschema)

app.get("/",function(req,res){
    res.render('home')
})

app.get("/register",function(req,res){
    res.render('register')
})

app.get("/login",function(req,res){
    res.render('login')
})

app.post("/register",function(req,res){
   var username=req.body.username
   var password=req.body.password
   var user= new usermodel({
     username:req.body.username,
     password:req.body.password
   })
   user.save().then(()=>
   res.redirect("/login"))
})

app.post("/login",function(req,res){
    var username=req.body.username
   var password=req.body.password
   usermodel.findOne({username:username},function(err,founduser){
    if(err){
        console.log(err);
    }
    else{
        if(founduser!=null){
            if(founduser.password==password){
             res.render("secrets")
        }
        }
        else{
           // alert("'please register")
            res.redirect("/register")
        }
    }
   })
})








app.listen(3000,function(){
    console.log("server runnig at port 3000");
})