const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Apifeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");


// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req,res,next) =>{

  //Pushing the images of products
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

    

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
});


// Get all products
exports.getAllProducts = catchAsyncErrors(async(req,res,next) =>{

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new Apifeatures(Product.find(),req.query)
        .search()
        .filter()

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query;

    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });

  

// Get Suggested Products
exports.getSuggestedProducts = catchAsyncErrors(async (req, res, next) => {

  const category = req.body.category;

  const suggestedproducts = await Product.find({category: category});

  res.status(200).json({
    success: true,
    suggestedproducts
  });
});

// Get Featured Products
exports.getFeaturedProducts = catchAsyncErrors(async (req, res, next) => {

  const products1 = await Product.find({category: "Laptop"});
  const products2 = await Product.find({category: "Camera"});
  const products3 = await Product.find({category: "SmartPhones"});
  const products4 = await Product.find({category: "Tops"});
  const products5 = await Product.find({category: "Attire"});
  const products6 = await Product.find({category: "Footwear"});
  const products7 = await Product.find({category: "Furniture"});
  const products8 = await Product.find({category: "Others"});

  const result = [];
  result[0] = products1[Math.floor(Math.random()*products1.length)];
  result[1] = products2[Math.floor(Math.random()*products2.length)];
  result[2] = products3[Math.floor(Math.random()*products3.length)];
  result[3] = products4[Math.floor(Math.random()*products4.length)];
  result[4] = products5[Math.floor(Math.random()*products5.length)];
  result[5] = products6[Math.floor(Math.random()*products6.length)];
  result[6] = products7[Math.floor(Math.random()*products7.length)];
  result[7] = products8[Math.floor(Math.random()*products8.length)];

  res.status(200).json({
    success: true,
    result
  });
});




// Get Product Details
exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);


    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        product,
    });
}); 



// Update Product --Admin
exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{


    let product = Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
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
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
}); 



// Delete Product --Admin
exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

    await product.remove();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    });
}); 


// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  console.log(avg);
  console.log(reviews.length);
  console.log(ratings);

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});



