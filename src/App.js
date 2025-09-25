const express = require('express');
const app=express();
const dbconnect =require('./config/database');
const User=require('./models/User');
//const {validationSignupData}=require('./utils/Validation');
const bcrypt=require('bcrypt');
const cookieparser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const { userAuth } = require('./middlewares/Auth');
app.use(express.json());
app.use(cookieparser());


app.post('/signup', async (req,res)=>{

    

    //console.log(req.body);
    // const user=new User(req.body);

    

    try{

        validationSignupData(req);
        const {firstName,lastName,emailId,password}=req.body;
        
        console.log(password);

          const passwordhash=await bcrypt.hash(password,10);

        const user=new User({
            firstName,lastName,emailId,password:passwordhash
         });
         

       
         console.log(passwordhash);
    await user.save();
    res.send('User signed up successfully'+user);
    }
    catch(err){
        res.status(400).send("error saving the user "+ err.message);
    }


});

app.post('/login',async(req,res)=>{

   // console.log("hhhh");

    try{

        const{emailId,password}=req.body;

        const user=await User.findOne({emailId:emailId});

      //  console.log(user);
        if(!user)
        {
            throw new Error("EmailId is not present in DB");
        }
        const isPasswordvalid=await user.validationpassword(password);
        if(isPasswordvalid){

            //create a jwt token

            const token= await user.getJWT();
            
            //console.log(token);
            
            //Add the token to cookie and send the response back to the server

            res.cookie("naresh",token,{expires: new Date(Date.now()+ 8*3600000),});


            res.send("login successfull!!!");
           // console.log(password);
            //console.log(isPasswordvalid);
        }else{
            throw new Error("password id not correct");
        }

    }

     catch(err){
        res.status(400).send("error saving the user "+ err.message);
    }
    

});

app.get("/profile",userAuth,async(req,res)=>{

    try{

    //validate my token
    const user=req.user;

   // console.log(user);
    res.send(user);

 
    //res.send("Reading cookie");
}catch(err){
    res.status(400).send("ERROR"+err.message);
}

});

app.post("/sendConnectionRequest",userAuth, async(req,res)=>{

    const user=req.user;
    //sending a connection request
    console.log("sending connection request");
    
    res.send(user.firstName+" sent connection request!");

});


dbconnect().then(()=>{
    console.log('Database connected successfully');
    const listen=app.listen(7777,()=>{
    console.log('Server is running on port 7777');

    });
}).catch((err)=>{
    console.log('Database connection failed',err);
});



