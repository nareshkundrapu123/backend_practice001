const mongoose=require('mongoose');




const dbconnect = async()=>{

    await mongoose.connect(
        "mongodb+srv://namasteydev:Naresh1998@namesteynode.azrncwa.mongodb.net/devTinder1"
    ); 
};

module.exports=dbconnect;