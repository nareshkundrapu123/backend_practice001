const express= require("express");
const { userAuth } = require("../middlewares/Auth");
const { validationprofile, forgetpassword } = require("../utils/Validation");
const User = require("../models/User");
const bcrypt= require('bcrypt');

const profileRouter= express.Router();


profileRouter.get("/profile/view",userAuth,async(req,res)=>{

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

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    // ✅ validate input
   if(!validationprofile) {
    return res.status(400).json({ error: "Invalid profile data" });
   }

    const loggedinuser = req.user;

    // ✅ update fields properly
    Object.keys(req.body).forEach((key) => {
      loggedinuser[key] = req.body[key];
    });

   const saveduser= await loggedinuser.save();

    // ✅ ONLY ONE response, after update
    res.status(200).json({
      success: true,
      user: saveduser,
      message: "Profile updated successfully"
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


profileRouter.post("/profile/forgotpassword", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            throw new Error("Email and new password are required");
        }

        // Check if user exists
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("EmailId is not valid");
        }

        // Update password (hash it if you’re using bcrypt)
     
const isPasswordvalid=await bcrypt.hash(password,10);

        //  const =await user.validationpassword(password);
           user.password = isPasswordvalid;
          // console.log(isPasswordvalid);
        await user.save();
console.log(isPasswordvalid);
        res.status(200).send({ message: "Password updated successfully" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

    
module.exports=profileRouter;