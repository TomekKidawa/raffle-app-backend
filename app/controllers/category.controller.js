const db = require('../models');
const Category = db.categories;
const User = require('../models/user.model')
const Notification = require('../models/notification.model')


exports.create =(req, res) =>{
    //create a category
    const category = new Category({
        name: req.body.name,
    })

    //save product in database
    category.save(category).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product."
      });
    });

};


exports.findAll = (req,res) => {
    Category.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving category."
        });
      });
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Category.findByIdAndRemove(id)
        .then(data => {
        if (!data) {
            res.status(404).send({
            message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
            });
        } else {
            res.send({
            message: "Category was deleted successfully!"
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Could not delete Category with id=" + id
        });
        });
};