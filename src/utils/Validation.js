
const validator=require('validator');


const validationSignupData=(req)=>{

    const{firstName,lastName,emailId,password}=req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!firstName.length<4 && lastName.length>50){
        throw new Error("FirstName should be 4-50 characters");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email id is not valid");
    }
    
};


const validationprofile=(req)=>{
    const allowededitfield=[
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "about",
        "skills"
    ];

    const isEditAllowed =Object.keys(req.body).every((field)=>
        allowededitfield.includes(field)
    );

    return isEditAllowed;
}   

const forgetpassword =(req)=>{

    const allowededitfield1=[
        "emailId",
        "password"
    ];
    const isEditpassword =Object.keys(req.body).every((field)=>
        isEditpassword.includes(field)
);

return isEditpassword;

}

module.exports={validationSignupData,
            validationprofile,
            forgetpassword
    };