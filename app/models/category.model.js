const mongoose = require("mongoose");

const Category = mongoose.model(
  "Category",
  new mongoose.Schema(
    {
    name: String,
    products:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
     
    ]
  },{ timestamps: true }
  )
);

module.exports = Category;

