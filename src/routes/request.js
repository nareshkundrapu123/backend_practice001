const express =require('express');
const { userAuth } = require('../middlewares/Auth');

const ConnectionRequest=require('../models/ConnectionRequest');
const User = require('../models/User');

const requestRouter=express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res)=>{

  try{

    const fromUserId=req.user._id;
    console.log("From user id:",fromUserId);
    const toUserId=req.params.toUserId;
    console.log("To user id:",toUserId);
    const status=req.params.status;   
    console.log("Status:",status);

    const toUser=await User.findById(toUserId);
    if(!toUser){
        return res.status(404).json({message:"To user not found"});
    }

    const allowedStatus=["ignore","interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"Invalid status value: "+ status});
    }
    // Check if a connection request already exists between the two users
    const existingRequest=await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ],  

    });
        if(existingRequest){
            return res.status(400).json({message:"Connection request already exists"});
        }
    const connectionRequest= new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
    });
    
    console.log("Connection request:",connectionRequest);

    const data=await connectionRequest.save();

    res.json({
        message: req.user.firstName + " is " + status+ " in "+  toUser.firstName,
        data,
    });



  }
  catch(err){

    res.status(400).send("ERROR:"+err.message);

  }
    
    //res.send(user.firstName+" sent connection request!");

});

 


module.exports=requestRouter;