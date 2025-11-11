const e = require('express');
const mongoose=require('mongoose');

const connectionRequestSchema=new mongoose.Schema({

        fromUserId:{
            
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true,
        },
        toUserId:{

            type:mongoose.Schema.Types.ObjectId,
            required:true,

        },
        status:{
            
            type:String,
            required:true,
                enum: {
            values:['ignore','interested','accepted','rejected'],
            message: '{VALUE} is not supported'
       
            }
        }



},
{
    timestamps:true

}
);

connectionRequestSchema.pre("save", function(next){
    
    const connectionRequest=this;
    //check if fromUserId and toUserId are same as userid
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("fromUserId and toUserId cannot be same");
    }

    next();

});


const ConnectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequestModel;