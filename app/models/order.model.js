const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    amount: Number,
    email: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String,
    isPaid: Boolean,
    isShipped: Boolean,
    orderDate:{
      type: Date,
      default: Date.now()
    },
    User: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    Product:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    paymentId: String,
    
  },{ timestamps: true }
  )
);

module.exports = Order;