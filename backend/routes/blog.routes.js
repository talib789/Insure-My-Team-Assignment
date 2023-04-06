const express =  require("express");
const { Authentication } = require("../middlewares/Authentication");
const { Blogmodel } = require("../models/blogs.model");


const blogRouter = express.Router();



// create a blog - POST

blogRouter.post("/",Authentication,async(req,res)=>{
    const {body,title,category}=req.body; 
    const userid=req.body.userid            //validating fields
    if(body&&title){
        try{
            const newBlog=await Blogmodel({...req.body,author:userid});   
            await newBlog.save();
            res.status(200).send({msg:"Published Successfully"})
        }catch(err){
            console.log(err);
            res.status(500).send({msg:err.message})
        }
    }else{
        res.status(404).send({msg:"All fields are required"})
    }
})
// get all blogs with pagination limit

blogRouter.get("/",async(req,res)=>{
    const {page} = req.body;
    const skipdata = (page-1)*9;
    const blog = req.params;
    try{
        const blogData=await Blogmodel.find(blog).skip(skipdata||0).limit(9)    //pagination
        res.status(200).send(blogData)      //sending blogs data

    }catch(err){
        res.status(404).send({msg:err.message})
    }

})
// get the specific blog with id
blogRouter.get("/:_id",async(req,res)=>{

    const blog=req.params
    try{
        const blogData=await Blogmodel.findOne({_id:blog._id})
        res.status(200).send(blogData)      //sending blogs data

    }catch(err){
        res.status(404).send({msg:err.message})
    }
})

// update a specific blog

blogRouter.patch("/:blogid",async(req,res)=>{
    const blog=req.params.blogid;
    const userid=req.body.userid
        try{
            const blogData=await Blogmodel.findOne({_id:blog,author:userid});       //Finding blog that has to be updated
            if(blogData&& Object.keys(blogData).length>0){
                await Blogmodel.findOneAndUpdate({_id:blog},{...req.body});
                res.status(200).send({msg:"Updated Successfully"})
            }else{
                res.status(400).send({msg:"There's some error while updating"})
            }
            
        }catch(err){
            res.status(500).send({msg:err.message})
        }
})
// delte a specific blog with user id

blogRouter.delete("/:blogid",Authentication,async(req,res)=>{
    const blog=req.params.blogid;
    const userid=req.body.userid
    try{
        const blogData=await Blogmodel.findOne({_id:blog,author:userid});       //Finding blog that has to be deleted
        if(blogData&& Object.keys(blogData).length>0){
            await Blogmodel.findOneAndDelete({_id:blog})
            res.status(200).send({msg:"Deleted Successfully"})
        }else{
            res.status(400).send({msg:"There's some error while deleting"})
        }
        
    }catch(err){
        res.status(500).send({msg:err.message})
    }
});

module.exports = {blogRouter}