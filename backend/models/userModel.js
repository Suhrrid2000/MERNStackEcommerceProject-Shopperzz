const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter your name"],
        maxlength:[40,"Name cannot exceed 40 characters"],
        minlength:[3,"Name should have atleast 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter your Password"],
        minlength:[8,"Password should have atleast 8 characters"],
        select:false
    },
    avatar:{ 
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }  
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,
});



// Encrypting user password before saving in the database
{/*userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }
    
    this.password = await bcrypt.hash(this.password,10)
})
*/}


// JWT token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    }); //ye key kisike haath lggya to he can make duplicate admin ids and fuck up everything
};


// Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){

    console.log(await bcrypt.compare(enteredPassword,this.password));
    return await bcrypt.compare(enteredPassword,this.password);
};


// Generating password reset token
userSchema.methods.getResetPasswordToken = function(){

    // Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");


    // Hashing and adding to userschema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    
    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
};

    




module.exports = mongoose.model("User",userSchema);