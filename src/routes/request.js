const express =require('express');
const { userAuth } = require('../middlewares/Auth');

const ConnectionRequest=require('../models/ConnectionRequest');
const User = require('../models/User');

const requestRouter=express.Router();

const UserSafeData= "firstName lastName emailId photoUrl skills";

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


 requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{

    console.log("Reviewing connection request...");
    try{

       const loggedinuser=req.user;
       const {status,requestId}=req.params;
        
       const allowedStatus=["accepted","rejected"];
       if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status value: "+ status});
       }
       const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedinuser._id,
            status:"interested",
       });
       if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found"});
       }
         connectionRequest.status=status;
         const data=await connectionRequest.save();
         res.json({
            message: loggedinuser.firstName + " has "+ status+ " the connection request",
            data,
         });

    }
    catch(err){

        res.status(400).send("ERROR:"+err.message);
    }


 });


 requestRouter.get("/user/request/received",userAuth, async(req,res)=>{

    try{

            const loggedinuser=req.user;

            const connectionRequests=await ConnectionRequest.find({
                toUserId:loggedinuser._id,
                status:"interested",
            }).populate("fromUserId","firstName LastName photoUrl emailId skills");

            res.json({
                message:"data fetched successfully ",
                data:connectionRequests,
            });



    }
    catch(err){

        res.status(400).send("ERROR:"+err.message);
    }
});

requestRouter.get("/user/connections",userAuth, async(req,res)=>{

    try{    
            const loggedinuser=req.user;

            const connections=await ConnectionRequest.find({
                $or:[
                    {fromUserId : loggedinuser._id, status:"accepted"},
                    {toUserId : loggedinuser._id, status:"accepted"},
                ]
            }).populate("fromUserId","firstName lastName photoUrl emailId skills");
                

            const data=connections.map((row)=>row.fromUserId);                                                                                  
            res.json({
               data,
            });



    }
    catch(err){

        res.status(400).send("ERROR:"+err.message);
    }
});

requestRouter.get("/feed",userAuth, async(req,res)=>{

    try{

        const loggedinuser=req.user;
        // res.send("Feed for "+ loggedinuser.firstName);
   
        const page= parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip=(page-1)*limit;
        const connections=await ConnectionRequest.find({
            $or:[{fromUserId : loggedinuser},{toUserId : loggedinuser}],
    }).select("fromUserId toUserId");

   // res.send(connections);

    const hiddenusers= new Set();

    connections.forEach((req)=>{
        hiddenusers.add(req.fromUserId.toString());
        hiddenusers.add(req.toUserId.toString());   
    });

    // console.log("Hidden users:",hiddenusers);

    const user= await User.find({
        $and:[
        {_id:{$nin: Array.from(hiddenusers)}},
        {_id:{$ne: loggedinuser._id}}
            
    ]

    }).select(UserSafeData)
    .skip(skip)
    .limit(limit);

    res.json(user);
}

    catch(err){
        res.status(400).send("ERROR:feed"+err.message);
    
    }

});


module.exports=requestRouter;