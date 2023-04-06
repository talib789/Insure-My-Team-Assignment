const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRoute } = require("./routes/user.routes");
const { blogRouter } = require("./routes/blog.routes");
require('dotenv').config();


const app = express();
app.use(express.json());

app.use(cors({
    origin: "*",
  }
))
// all end points listed here

app.use("/",userRoute);
app.use("/blog",blogRouter);


// access port though env

const PORT = process.env.PORT || 8080

app.listen(PORT,async()=>{
    console.log("Server has started on Port no "+PORT)
    try{
        await connection;
        console.log("db connected")
    }catch(err){
        console.log("db not connected"+err.message)
    }
})