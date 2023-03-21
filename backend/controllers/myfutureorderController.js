const myfutureOrder = require("../models/myfutureorderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail.js")
const User = require("../models/userModel");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {

        orderItems
        
    } = req.body;

    const order = await myfutureOrder.create({
        
        orderItems,
        user: req.user._id,
        price: Product.price,
    });

    res.status(201).json({
        success: true,
        order,
    });
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await myfutureOrder.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await myfutureOrder.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await myfutureOrder.find();

    //   let totalAmount = 0;

    //   orders.forEach((order) => {
    //     totalAmount += order.totalPrice;
    //   });

    res.status(200).json({
        success: true,
        // totalAmount,
        orders,
    });
});


// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await myfutureOrder.findById(req.params.id);
    const user = await User.findOne(req.params.id.user);
    

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    // if (order.orderStatus === "Delivered") {
    //     return next(new ErrorHander("You have already delivered this order", 400));
    // }

    // if (req.body.status === "Shipped") {
    //     order.orderItems.forEach(async (o) => {
    //         await updateStock(o.product, o.quantity);
    //     });
    // }
    // order.orderStatus = req.body.status;

    if (Product.price <= req.body.newprice) {
        // order.deliveredAt = Date.now();
        // order.newprice = req.body.price
   
    //-------------------------------------------------------------
    try {

        await order.save({ validateBeforeSave: false });

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Price Dropper`,
            message: `Product Price drop .......`,
        })

        
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} succcessfully`,
        })

    } catch (error) {
        // user.resetPasswordToken = undefined;
        // user.resetPasswordExpire = undefined;

        // await user.save({ validateBeforeSave: false });

        return next(new ErrorHander(error.message, 500));
    };


}
    //-------------------------------------------------------------
    // await order.save({ validateBeforeSave: false });
    // res.status(200).json({
    //     success: true,
    // });
});

// async function updateStock(id, quantity) {
//     const product = await Product.findById(id);

//     product.Stock -= quantity;

//     await product.save({ validateBeforeSave: false });
// }

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await myfutureOrder.findById(req.params.id);

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});