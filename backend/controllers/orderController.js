const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// Create new Order
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{

    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});




// Get single order
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404));
    }

    res.status(200).json({
        success:true,
        order
    });
});




// Get logged in user orders
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find({ user: req.user._id });

    

    res.status(200).json({
        success:true,
        orders
    });
});





// Get all orders --Admin
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find();

    let totalAmount = 0;
    
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    });
});




// Update order status --Admin
exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("Order already delivered", 400));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.quantity);
        });
      }

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({
        validateBeforeSave: false
    });

    res.status(200).json({
        success:true
    });
});

// function to update current stock...called at line 107
async function updateStock (id, quantity){

    const product = await Product.findById(id);

    product.Stock -= quantity;

    if(product.Stock<0){
        product.Stock = 0;
    }

    await product.save({ validateBeforeSave: false });
}




// delete Order
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }

    await order.remove();

    res.status(200).json({
        success:true
    });
});
