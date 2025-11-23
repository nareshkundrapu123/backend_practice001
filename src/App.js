const express = require('express');
const app=express();
const dbconnect =require('./config/database');

const cors=require('cors');

const cookieparser=require('cookie-parser');

// app.use(cors(
//     {
//      origin:'*',
//     credentials:true,  
//     }
// ));

const allowedOrigins = ['http://localhost:5173','http://localhost:5174'];

app.use(cors({
  origin: "http://localhost:5173",   // your frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


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



