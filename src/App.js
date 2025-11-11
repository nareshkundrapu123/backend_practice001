const express = require('express');
const app=express();
const dbconnect =require('./config/database');

const cors=require('cors');

const cookieparser=require('cookie-parser');

app.use(cors(
    {
     origin:"http://localhost:5173",
        credentials:true,  
    }
));
app.use(express.json());
app.use(cookieparser());


 const authRouter= require("./routes/auth");
 const profileRouter=require("./routes/profile");
 const requestRouter=require("./routes/request");

 app.use("/", authRouter);
 app.use("/", profileRouter);
 app.use("/", requestRouter);
 

dbconnect().then(()=>{
    console.log('Database connected successfully');
    const listen=app.listen(7777,()=>{
    console.log('Server is running on port 7777');

    });
}).catch((err)=>{
    console.log('Database connection failed',err);
});



