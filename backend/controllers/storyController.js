const Story = require("../models/storyModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Apifeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");


// Create Story -- Admin
exports.createStory = catchAsyncErrors(async (req,res,next) =>{

  //Pushing the images of story
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "stories",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

    

    const story = await Story.create(req.body);

    res.status(201).json({
        success:true,
        story
    });
});


// Get all stories
exports.getAllStories = catchAsyncErrors(async(req,res,next) =>{

    var stories = await Story.find().sort({"createdAt": -1});

    //Deleting stories which are 2 days old
    const currDate = Date.now();

    for(var i=0; i<stories.length; i++){
      const storyDate = stories[i].createdAt;
      const millis = currDate - storyDate;
      const sec = Math.floor(millis / 1000);
      const hrs = Math.floor(sec/3600);
      if(hrs >= 48){
        const story = await Story.findById(stories[i]._id);
        if(!story){
          return next(new ErrorHandler("Story not found",404));
        }

    // Deleting Images From Cloudinary
    for (let j = 0; j < story.images.length; j++) {
      await cloudinary.v2.uploader.destroy(story.images[j].public_id);
    }
    await story.remove();
      }
    }

    stories = await Story.find().sort({"createdAt": -1});
  
    res.status(200).json({
      success: true,
      stories,
    });
});

// Get All Stories (Admin)
exports.getAdminStories = catchAsyncErrors(async (req, res, next) => {

    const stories = await Story.find();
  
    res.status(200).json({
      success: true,
      stories,
    });
  });




// Get Story Details
exports.getStoryDetails = catchAsyncErrors(async(req,res,next)=>{

    const story = await Story.findById(req.params.id);


    if(!story){
        return next(new ErrorHandler("Story not found",404));
    }

    res.status(200).json({
        success:true,
        story,
    });
}); 



// Update Story --Admin
exports.updateStory = catchAsyncErrors(async(req,res,next)=>{


    let story = Story.findById(req.params.id);

    if(!story){
        return next(new ErrorHandler("Story not found",404));
    }

    // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < story.images.length; i++) {
      await cloudinary.v2.uploader.destroy(story.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "stories",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    story = await Story.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        story
    })
}); 



// Delete Story --Admin
exports.deleteStory = catchAsyncErrors(async(req,res,next)=>{

    const story = await Story.findById(req.params.id);

    if(!story){
        return next(new ErrorHandler("Story not found",404));
    }

    // Deleting Images From Cloudinary
  for (let i = 0; i < story.images.length; i++) {
    await cloudinary.v2.uploader.destroy(story.images[i].public_id);
  }

    await story.remove();

    res.status(200).json({
        success:true,
        message:"Story deleted successfully"
    });
}); 






