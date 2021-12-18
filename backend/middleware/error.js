const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server Error";


    // Wrong Mongodb Id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }


    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Entered ${Object.keys(err.keyValue)} already exists, Please login to access your account`;
        err = new ErrorHandler(message, 400);
    }



    
    // Wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, Please try again`;
        err = new ErrorHandler(message, 400);
    }



    // JWT Expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token got expired, please re-login or register as a new user and try again`;
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};