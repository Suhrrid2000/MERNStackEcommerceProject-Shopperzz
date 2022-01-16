const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { findById } = require("../models/userModel");
const cloudinary = require("cloudinary");

// Register users
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    
    //Sending welcome mail to users
    const message = `Hi ${name}, \n\nGreetings of the day. Hope you're doing good during this pandemic. Welcome to the Shopperzz family & thankyou for choosing us as your shopping partner.\n\nEnjoy shopping with us and fulfill your day to day shopping needs with assured delivery within 7 days and exciting discounts & cashbacks.\n\nThanks & regards,\nShopperzz team`;

    try {
        await sendEmail({
            email: email,
            subject: `Welcome to Shopperzz`,
            message,
        });
    }
    catch(error) {
        return next(new ErrorHandler(error.message, 500));
    } 

    sendToken(user,201,res);
}); 



// Login User
exports.loginUser = catchAsyncErrors (async (req,res,next)=>{

    const {email,password} = req.body;

    // checking if user has given both email & password
    if(!email || !password){
        return next(new ErrorHandler("Please enter both Email & Password",400))
    }


    const user = await User.findOne({ email }).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = (user.password === password) ? true : false;

    //const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res);

});



// Logout user
exports.logout = catchAsyncErrors(async(req,res,next)=>{


    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    });
});



// Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findOne({ email:req.body.email });

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPassword token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});


    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {

        await sendEmail({
            email: user.email,
            subject: `Shopperzz Password Recovery`,
            message,
        });

        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} successfully`,
        });

    }
    catch(error) {
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }


});






// Reset Password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },

    });

    if(!user){
        return next (new ErrorHandler("Reset Password Token is either invalid or expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next (new ErrorHandler("Password doesn't match", 400));
    }


    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

});




// Get User details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});



// Update User Password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = (user.password === req.body.oldPassword) ? true : false;

    //const isPasswordMatched = user.comparePassword(oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if (req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password and confirm password doesn't match",400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});




// Update User Profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    if(!newUserData.name && !newUserData.email){
        res.status(400).json({
            success:false,
            message:"Please enter your name and email"
        });
    }else if (!newUserData.name && newUserData.email){
        res.status(400).json({
            success:false,
            message:"Validation failed: name: Please Enter your Name"
        });
    }else if (!newUserData.email && newUserData.name){
        res.status(400).json({
            success:false,
            message:"Validation failed: email: Please Enter your Email"
        });
    }else{

        if (req.body.avatar !== "") {
            const user = await User.findById(req.user.id);
        
            const imageId = user.avatar.public_id;
        
            await cloudinary.v2.uploader.destroy(imageId);
        
            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
              folder: "avatars",
              width: 150,
              crop: "scale",
            });
        
            newUserData.avatar = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
    
        res.status(200).json({
            success:true,
        });
    }
});





// Get all users -- Admin
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });

});



// Get single user -- Admin
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler("User does not exist",400));
    }

    res.status(200).json({
        success: true,
        user
    });

});




// Update user Role --Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    let user = User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler("User does not exist",400));
    }

    if(!newUserData.name && !newUserData.email && !newUserData.role){
        res.status(400).json({
            success:false,
            message:"Please enter your name, email and role"
        });
    }else if (!newUserData.name && newUserData.email && newUserData.role){
        res.status(400).json({
            success:false,
            message:"Validation failed: name: Please Enter your Name"
        });
    }else if (!newUserData.email && newUserData.name && newUserData.role){
        res.status(400).json({
            success:false,
            message:"Validation failed: email: Please Enter your Email"
        });
    }else if (!newUserData.role && newUserData.name && newUserData.email){
        res.status(400).json({
            success:false,
            message:"Validation failed: role: Please Enter your Role"
        });
    }else{
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
    
        res.status(200).json({
            success:true,
        });
    }
});





// Delete user --Admin
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    });
});




// Create new review/update reviews
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{

    const { rating,comment,productId } = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev=>rev.user.toString()===req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculating avg rating
    let avg = 0;
    product.ratings = product.reviews.forEach(rev=>{
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success: true
    });
});




// Delete Review
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    // Calculating avg rating
    let avg = 0;

    reviews.forEach(rev=>{
        avg += rev.rating;
    });

    let ratings=0;

    if(reviews.length === 0){
        ratings=0;
    }else{
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });
});



// Get all Reviews of a product
exports.getProductReviews = catchAsyncErrors(async(req,res,next) => {
    
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    });
});
