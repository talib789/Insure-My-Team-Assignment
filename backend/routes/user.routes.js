const express=require("express");
const bcrypt=require("bcryptjs");

const userRoute=express.Router();
const JWT=require("jsonwebtoken");
const { Usermodel } = require("../models/user.model");

// signup 
userRoute.post("/signup",async(req,res)=>{
    const {email,password,name} = req.body;
    if(email&&password&&name){
        const hashedPassword=await bcrypt.hash(password,12) //hashing the password before save it to the database


        try{
            //  create the new with the upcoming user for the database
            const newUser=await Usermodel({...req.body,password:hashedPassword});
            // now save it in the database
            await newUser.save()

            res.status(200).send({msg:"Account Created Successfully"})

        }catch(err){
            res.status(500).send({msg:err.message})
        }
    }
    else{
        res.status(400).send({msg:"Validation Failed"})
    }
})


// login

userRoute.post("/login",async(req,res)=>{
    const {email,password} = req.body;

    if(email && password){

        try{

            const userDetails = await Usermodel.findOne({email});
            const isMatch=await bcrypt.compare(password,userDetails.password);

            if(isMatch){
                const token=await JWT.sign({userid:userDetails._id},process.env.JWT_SECRET)
                res.status(200).send({msg:"Success",token,userid:userDetails._id,data:userDetails})
            }
            else{
                res.status(404).send({msg:"Authentication Failed"})
            }

        }catch(err){
            res.status(404).send({msg:err.message})
        }



    }
    else{
        res.status(404).send({msg:"All fields are required"})
    }
})


module.exports={userRoute}