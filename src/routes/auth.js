const express= require('express');
const { validationSignupData } = require('../utils/Validation');
const User = require('../models/User');
const bcrypt= require('bcrypt');
const authRouter = express.Router();

authRouter.post('/signup', async (req,res)=>{

    

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
         

       
       //  console.log(passwordhash);
   const saveduser= await user.save();
    res.send('User signed up successfully'+saveduser);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }


});

authRouter.post('/login',async(req,res)=>{

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


            res.status(200).json({status:true, message: 'logged in successfully',
                 user:user,
                token:token
            });
           // console.log(password);
            //console.log(isPasswordvalid);
        }else{
            throw new Error("password mismatch");

        }

    }

     catch(err){
        // res.status(400).send("Error :"+ err.message);
        res.status(400).json({status: false, message: err.message});
    }
    

});

authRouter.post('/logout', async(req,res) =>{
    
    res.cookie("naresh",null,{
        expires:new Date(Date.now()),
    })

    res.send("logged out successfully");
});


module.exports=authRouter;