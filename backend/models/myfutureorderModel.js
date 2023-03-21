const mongoose = require("mongoose");

const myfutureorderSchema = new mongoose.Schema({

  // orderItems:
  //   {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      newprice: {
        type: Number,
        required: true,
      },
    
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
  // },
  
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

});

module.exports = mongoose.model("myfutureOrder", myfutureorderSchema);