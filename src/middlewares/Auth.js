const jwt=require('jsonwebtoken');
const User = require('../models/User');


const userAuth= async(req,res,next)=>{
    //Read the token from the cookies validate the token find the user 
try{
    const {naresh}=req.cookies;

    if(!naresh){
        return res.status(401).send("Please login");
    }

    const decodeobj= await jwt.verify(naresh,"Dev@tinder$1998");
    const {_id}=decodeobj;
    const user= await User.findById(_id);
    if(!user)
    {
        throw new Error("User not found");
    }
    req.user=user; 
    next(); 
}
catch(err){
        
    res.status(400).send("ERROR",+err.message);
}

};

module.exports={userAuth};