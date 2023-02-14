const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')


// const Product = mongoose.model(
//   "Product",
//   new mongoose.Schema(
//     {


module.exports = () => {
  var schema = mongoose.Schema(
      {
      title: String,
      description: String,
      price: String,
      imageFile: String,
      creator: String,
      raffleTime: Date,
      isPublic: Boolean,
      isPurshased: Boolean,
      isWinner: Boolean,
      usersInRaffle:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      category:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category"
        }
      ],
      UserWonRaffle:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      likeCount:{
          type: Number,
          default: 0
      }
     },{ timestamps: true }
  )
// );


schema.plugin(mongoosePaginate)

    const Product = mongoose.model("Product", schema)
    return Product
}

// module.exports = Product;

