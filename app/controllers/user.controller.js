const db = require("../models");
const User = db.user;


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
  
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
  
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.findAll= (req,res) => {
    
    const username = req.query.username;

    var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};
  
    User.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
    });

};

exports.findOne = (req, res) => {
  
    const id = req.params.id;
  
    User.findById(id)
      .populate('participatesInRaffles')
      .populate('ProductWonRaffle')
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found User with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving User with id=" + id });
      });
};


// update user
exports.update = (req, res) => {

    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
        if (!data) {
            res.status(404).send({
            message: `Cannot update User with id=${id}. Maybe user was not found!`
            });
        } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
        res.status(500).send({
            message: "Error updating user with id=" + id
        });
    });
};

// delte user
exports.delete = (req, res) => {

    const id = req.params.id;

    User.findByIdAndRemove(id)
        .then(data => {
        if (!data) {
            res.status(404).send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
            });
        } else {
            res.send({
            message: "User was deleted successfully!"
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Could not delete user with id=" + id
        });
        });
};


// exports.findForCurrentRaffles = (req,res) => {
//     User.find({ category:  { $in: [req.params.id] }, isPublic:true, isWinner:false })
//       .populate('category')
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving product."
//         });
//       });
//   }