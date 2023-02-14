const db = require('../models');
const Order = db.orders;
const User = require('../models/user.model')
// const Product = require('../models/product.model')
const Product = db.products // after pagination
const Notification = require('../models/notification.model')



exports.create =(req, res) =>{
    //create a product
    
    const order = new Order({
        email: req.body.email,
        address:  req.body.address,
        city:  req.body.city,
        postalCode:  req.body.postalCode,
        phone:  req.body.phone,
        isPaid: req.body.isPaid ? req.body.isPaid : false,
        isShipped: req.body.isShipped ? req.body.isShipped : false,
        User:[req.body.User],
        Product:[req.body.Product]
    })
    //set this product isPurshased = true
    Product.updateOne({ _id: req.body.Product }, {$set: { isPurshased:true, isPublic:false } }).then(()=>{})
    Product.findById(req.body.Product)
            .then((currentProduct) => {
              const notification = new Notification({
                          content: "Pomyślnie zakupiono: "+ currentProduct.title ,
                          receiver: req.body.User,
                          product: currentProduct._id
                        })
                        notification.save(notification).then(() => {})
            })
            .catch(err => {err});
    //save order in database
    order.save(order).then(data => {
      res.send(data);
        
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Order."
      });
    });

};

exports.findAll = (req,res) => {
    Order.find()
    .populate('User')
    .populate('Product')
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving products."
        });
      });
}

exports.findOne = (req, res) => {
    const id = req.params.id;
      Order.findById(id)
      .populate('User')
      .populate('Product')
        .then(data => {
          if (!data)
            res.status(404).send({ message: "Not found Order with id " + id });
          else res.send(data);
        })
        .catch(err => {
          res
            .status(500)
            .send({ message: "Error retrieving Order with id=" + id });
         });
  };

  exports.findAllToSpecificUser = (req,res) => {
    Order.find({ User:  { $in: [req.params.id] } })
      .populate('User')
      .populate('Product')
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

  
exports.delete = (req, res) => {
  const id = req.params.id;
  Order.findByIdAndRemove(id)
      .then(data => {
      if (!data) {
          res.status(404).send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`
          });
      } else {
          res.send({
          message: "Order was deleted successfully!"
          });
      }
      })
      .catch(err => {
      res.status(500).send({
          message: "Could not delete Order with id=" + id
      });
      });
};


exports.update = (req, res) => {

  if (!req.body) {
      return res.status(400).send({
      message: "Data to update can not be empty!"
      });
  }

  const id = req.params.id;

  Order.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
      if (!data) {
          res.status(404).send({
          message: `Cannot update Order with id=${id}. Maybe Product was not found!`
          });
      } else 
      res.send({ message: "Order was updated successfully." });
      })
      .catch(err => {
      res.status(500).send({
          message: "Error updating Order with id=" + id
      });
      });
};

exports.deleteAll = (req, res) => {
  Order.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} orders were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all orders."
      });
    });
};