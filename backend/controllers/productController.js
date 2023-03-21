const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

const myfutureOrder = require("../models/myfutureorderModel");
const sendEmail = require("../utils/sendEmail.js")
const User = require("../models/userModel");


// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
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
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
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

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  // let product = await Product.findById(req.params.id);

  // if (!product) {
  //   return next(new ErrorHander("Product not found", 404));
  // }

  // // Images Start Here
  // let images = [];

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  // if (images !== undefined) {
  //   // Deleting Images From Cloudinary
  //   for (let i = 0; i < product.images.length; i++) {
  //     await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  //   }

  //   const imagesLinks = [];

  //   for (let i = 0; i < images.length; i++) {
  //     const result = await cloudinary.v2.uploader.upload(images[i], {
  //       folder: "products",
  //     });

  //     imagesLinks.push({
  //       public_id: result.public_id,
  //       url: result.secure_url,
  //     });
  //   }

  //   req.body.images = imagesLinks;
  // }

  // product = await Product.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  //   useFindAndModify: false,
  // });

  // res.status(200).json({
  //   success: true,
  //   product,
  // });
  // ************************************************************************
  let product1 = await Product.findById(req.params.id);
  console.log(product1._id)
  
  // const order = await myfutureOrder.findById(req.params.id); 
  const order = await myfutureOrder.findOne({ "orderItems.product": req.params.id });
  console.log(order._id)

  // const user = User.findOne(req.params.id.user);  _id  
  const user = await User.findOne({ "_id": order.user });
  console.log(user._id)

  // const user = await User.findOne(order.user);


  if (!product1) {
    return next(new ErrorHander("Product not found", 404));

  }

  product1 = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false

  });
   


  // ----------------------------------------------------------
  // const order = await myfutureOrder.findById(req.params.id);
  // const user = await User.findOne(req.params.id.user);


  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }
  if (!user) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
      return next(new ErrorHander("You have already delivered this order", 400));
  }
   
  
  if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.quantity);
      });
  }
  order.orderStatus = req.body.status;
   
  // Code to check Price 

  if (order.orderItems.newprice >= product1.price) {
    // order.deliveredAt = Date.now();
    // order.newprice = req.body.price
    console.log("I am inside if block.")

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
        product1,
        message: `Email sent to ${user.email} succcessfully . Since your price drop to your require price`,
      })

    } catch (error) {

      return next(new ErrorHander(error.message, 500));
    };
    //-------------------------------------------------------------
    //   res.status(200).json({
    //     success:true,
    //     product,
    // })

  }
  else {
    console.log("I am inside else block");
    // res.status(404).json({
    //   success: false,

    // })
    res.status(200).json({
          success:true,
          product1,
          message: `Email cannot be sent to ${user.email} . Since your price not drop to your require price`,
      })
  }
});

// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
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
