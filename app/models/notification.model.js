const mongoose = require("mongoose");

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema(
    {
    content: String,
    receiver:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    product:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
        }
    ],
  },{ timestamps: true }
  )
);

module.exports = Notification;
