const mongoose = require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        
        // validate(value){
        //     if(!validator.isEmail(value))
        //     {
        //         throw new Error("Invalid emailid added: " +value);
        //     }
        // },
    },
    password:{
        type:String,
        required:true, 
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value))
            {
                throw new Error("Gender is not valid");
            }
            }, 
    },
    photoUrl:{
        type:String,
        default:"https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png",
    },
    about:{
        type:String,
        default:"This is a default about of the user",
    },
    skills:{
        type:[String],
    },
    

},
    {
        timestamps:true,
    }
);

userSchema.methods.getJWT= async function() {

    const user=this;

    const naresh= await jwt.sign({_id:user._id},"Dev@tinder$1998",{expiresIn:"1d",});

    return naresh;

    
};

userSchema.methods.validationpassword= async function(passwordinputbyuser) {

    const user=this;
    const passwordhash=user.password;

    const isPasswordvalid1=await bcrypt.compare(passwordinputbyuser,passwordhash);
    

    return isPasswordvalid1;



};

userSchema.index({ emailId: 0 }, { unique: true }); 

module.exports=mongoose.model('User',userSchema);