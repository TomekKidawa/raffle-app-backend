const db = require('../models');
const Notification = db.notifications;
const { user } = require('../models');
const User = require('../models/user.model')
const { product } = require('../models');
//const Product = require('../models/product.model')
const Product = db.products  // after pagination it should look like this instead // const Product = require('../models/product.model')


exports.create =(req, res) =>{
    //create a product
    const notification = new Notification({
        content: req.body.content,
        //receiver: req.body.receiver,
    })

    //save notification in database
    notification.save(notification).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Notification."
      });
    });

};

exports.findAll = (req,res) => {
  const title = req.query.title;

  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Notification.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notification."
      });
    });
}

exports.deleteAll = (req, res) => {
  Notification.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} notifications were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all notifications."
      });
    });
};

// in body _iduser = user id,  _idproduct = id product
exports.AddNotificationEnter = (req, res) =>{
  try{
    User.findById(req.body._iduser)
        .then((currentUser) => {
            Product.findById(req.body._idproduct)
                .then((currentProduct)=>{

                  const notification = new Notification({
                    content: "You Entered the "+ currentProduct.title + " raffle!",
                    receiver: req.body._iduser,
                    product: req.body._idproduct
                    //receiver: req.body.receiver,
                })
            
                //save notification in database
                notification.save(notification).then(data => {
                  res.send(data);
                })

                })
      })
  } catch(err){
    res.status(500).send(err)
  }
}

// in body _iduser = user id,  _idproduct = id product
exports.AddNotificationExit = (req, res) =>{
  try{
    User.findById(req.body._iduser)
        .then((currentUser) => {
            Product.findById(req.body._idproduct)
                .then((currentProduct)=>{

                  const notification = new Notification({
                    content: "You're no longer in the "+ currentProduct.title + " raffle!",
                    receiver: req.body._iduser,
                    product: req.body._idproduct
                    //receiver: req.body.receiver,
                })
            
                //save notification in database
                notification.save(notification).then(data => {
                  res.send(data);
                })

                })
      })
  } catch(err){
    res.status(500).send(err)
  }
}

// find by typing in body _id: iduser // usefull to find all notification to spec user.
exports.findAllToSpecificUser = (req,res) => {
  Notification.find({ receiver:  { $in: [req.body._id] } })
    .populate('product', 'imageFile')
    .sort({_id:-1}).limit(6)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notifications."
      });
    });
}

exports.SendNotificationAddProducts=(title, product) =>{
  let tempUsers = []
  User.find().then(data =>{
    for(let i = 0; i < data.length; i++){
      tempUsers.push(data[i]._id)
    }
    const notification = new Notification({
      content: "New raffle is available!!! "+ title,
      receiver: tempUsers,
      product: product
    })
    notification.save(notification).then(() => {})
  }).catch(err => {
      res.status(500).send({
          message: "some error with users"
      });
  });
}


// exports.SendWinnerNotification=(title, product) =>{
//   let tempUsers = []

// }
