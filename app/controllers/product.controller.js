const db = require('../models');
const Product = db.products;
const { user } = require('../models');
const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const Category = require('../models/category.model')
const notification = require("../controllers/notification.controller.js");


const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.create =(req, res) =>{
    //create a product
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        imageFile: req.body.imageFile,
        creator: req.body.creator,
        isPublic: req.body.isPublic ? req.body.isPublic : false,
        isPurshased: req.body.isPurshased ? req.body.isPurshased : false,
        raffleTime: req.body.raffleTime,
        price: req.body.price,
        isWinner: req.body.isWinner ? req.body.isWinner : false,
        // usersInRaffle: req.body.usersInRaffle,  no needed here
        category: req.body.category,
        // likeCount: req.body.likeCount no needed here
    })

    //notification to all users
    // notification.SendNotificationAddProducts(product.title, product._id);
    // let tempUsers = []
    // User.find().then(data =>{
    //   for(let i = 0; i < data.length; i++){
    //     tempUsers.push(data[i]._id)
    //   }
    //   const notification = new Notification({
    //     content: "Dodany nowy produkt! "+ product.title,
    //     receiver: tempUsers,
    //     product: product._id
    //   })
    //   notification.save(notification).then(() => {})
    // }).catch(err => {
    //     res.status(500).send({
    //         message: "some error with users"
    //     });
    // });

   
    //save product in database
    product.save(product).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product."
      });
    });

};

// for moderator view
exports.findAll = (req,res) => {
//   const title = req.query.title;
//   var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
//   Product.find(condition)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving products."
//       });
//     });
// };

  const { page, size, title } = req.query;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  const { limit, offset } = getPagination(page, size);

  Product.paginate(condition, { offset, limit, populate:'category'})
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        products: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product.",
      });
    });
};
  
//to all users
exports.findAllpublic = (req,res) => {
  // Product.find({ isPublic:true, isWinner:false})
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving products."
  //     });
  //   });


  const { page, size, title } = req.query;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" },isPublic:true, isWinner:false } 
    : {} && { isPublic:true, isWinner:false}

  const { limit, offset } = getPagination(page, size);

  Product.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        products: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product.",
      });
    });



}

exports.findAllpublicByCategory = (req,res) => {
  Product.find({ category:  { $in: [req.params.id] }, isPublic:true, isWinner:false })
    .populate('category')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product."
      });
    });
}


exports.findOne = (req, res) => {
  const id = req.params.id;
    Product.findById(id)
    .populate('usersInRaffle')
    .populate('category')
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + id });
       });
};

exports.findOneWithoutPop = (req, res) => {
  const id = req.params.id;
    Product.findById(id)
    .populate('category')
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + id });
       });
};


exports.update = (req, res) => {
      if (!req.body) {
          return res.status(400).send({
          message: "Data to update can not be empty!"
          });
      }
      const id = req.params.id;
      Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
          .then(data => {
          if (!data) {
              res.status(404).send({
              message: `Cannot update Product with id=${id}. Maybe Product was not found!`
              });
          } else 
          res.send({ message: "Product was updated successfully." });
          })
          .catch(err => {
            res.status(500).send({
                message: "Error updating Product with id=" + id
            });
          });
};

exports.setPublic = (req,res) =>{
    const id = req.params.id;
    Product.findById(id)
      .then(product => {
        Product.updateOne({ _id: product.id }, {$set: { isPublic:true } })
          .then(()=>{
            notification.SendNotificationAddProducts(product.title, product._id);
          })
      res.send({ message: "Product is Public now!." });
    })
    .catch(err => {
    res.status(500).send({
        message: "Error updating product with id=" + id
    });
  });
}


exports.delete = (req, res) => {

    const id = req.params.id;

    Product.findByIdAndRemove(id)
        .then(data => {
        if (!data) {
            res.status(404).send({
            message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
            });
        } else {
            res.send({
            message: "Product was deleted successfully!"
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Could not delete Product with id=" + id
        });
        });
};


exports.addUserToRaffle = (req, res) =>{
  try{
    Product.findById(req.params.id)
        .then((currentProduct) => {
            User.findById(req.body._id)
                .then((user)=>{
                  if(!currentProduct.usersInRaffle.includes(req.body._id)){
                          currentProduct.usersInRaffle.push(req.body._id)
                          user.participatesInRaffles.push(req.params.id )
                          res.status(200).send("The user has been added to Raffle")
                          return user.save() && currentProduct.save()
                  }else{
                    res.status(403).send("This user is already in raffle")
                  }
                })
      })
  } catch(err){
    res.status(500).send(err)
  }
}

exports.removeUserFromRaffle = (req,res)=>{
  try{
    Product.findById(req.params.id)
        .then((currentProduct) => {
            User.findById(req.body._id)
                .then((user)=>{
                  if(currentProduct.usersInRaffle.includes(req.body._id)){
                        currentProduct.usersInRaffle.pull(req.body._id)
                        user.participatesInRaffles.pull(req.params.id )
                        res.status(200).send("The user has been removed from the raffle")
                        return user.save() && currentProduct.save()
                  }else{
                    res.status(403).send("The user is not in raffle anymore")
                  }
                })
      })
  } catch(err){
    res.status(500).send(err)
  }
}

exports.drawTheWinner = (req,res)=>{
  let random = {};
  try{
    Product.findById(req.params.id)
        .then((currentProduct) => {
          if(currentProduct.isWinner === false){
                  if(currentProduct.usersInRaffle.length != 0){
                      random = Math.floor(Math.random() * (currentProduct.usersInRaffle.length));

                      User.findById(currentProduct.usersInRaffle[random]._id)
                        .then((user)=>{
                          if(currentProduct.usersInRaffle.includes(currentProduct.usersInRaffle[random]._id)){
                                currentProduct.UserWonRaffle.push(currentProduct.usersInRaffle[random]._id)
                                user.ProductWonRaffle.push(currentProduct.id)
                                Product.updateOne({ _id:currentProduct._id }, {$set: { isWinner:true, isPublic:false } }).then(()=>{})
                                            //add win notification to user 

                                            const notification = new Notification({
                                              content: "Gratulacje! wygrałeś loterie: "+ currentProduct.title ,
                                              receiver: currentProduct.usersInRaffle[random]._id,
                                              product: currentProduct._id
                                              //receiver: req.body.receiver,
                                            })
                                            //save notification in database
                                            notification.save(notification).then(() => {
                                              // ;res.send(data)
                                            })


                                res.status(200).send("ilosc w tablciy: " + currentProduct.usersInRaffle.length + " losowy: " 
                                                      + random + "wylosowane id:" + currentProduct.usersInRaffle[random]._id )
                                // res.status(200).send("The user has been found")
                              return user.save() && currentProduct.save()
                          }else{
                            res.status(403).send("cant find the user")
                          }
                        })

                  }else{
                    res.status(403).send("no one took part in the raffle")
                  }
          }else{
            res.status(403).send("the product already has winners")
          }
      })
  } catch(err){
    res.status(500).send(err)
  }
}

exports.resetWinner = (req,res)=>{
  const idProduct = req.body._idProduct;
  const idUser = req.body._idUser;

  try{
    Product.findById(idProduct)
        .then((currentProduct) => {
            User.findById(idUser)
                .then((user)=>{
                  if(currentProduct.usersInRaffle.includes(idUser)){
                        currentProduct.UserWonRaffle.pull(idUser)
                        user.ProductWonRaffle.pull(idProduct)
                        Product.updateOne({ _id:currentProduct._id }, {$set: { isWinner:false } }).then(()=>{})
                        res.status(200).send("reset successfully")
                        return user.save() && currentProduct.save()
                  }else{
                    res.status(403).send("reset unsuccessfully")
                  }
                })
      })
  } catch(err){
    res.status(500).send(err)
  }
}

exports.findForCurrentRaffles = (req,res) => {
  Product.find({ usersInRaffle:  { $in: [req.params.id] }, isPublic:true, isWinner:false })
    .populate('category')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product."
      });
    });
}

exports.findForModAllPublic= (req,res) => {
  Product.find({isPublic:true})
    .populate('category')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product."
      });
    });
}

exports.findForModAllNonPublic= (req,res) => {
  Product.find({isPublic:false})
    .populate('category')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product."
      });
    });
}

exports.findForModAllPurshased= (req,res) => {
  Product.find({isPurshased:true})
    .populate('category')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product."
      });
    });
}

exports.findForModAllIsWinner= (req,res) => {
  Product.find({isWinner:true})
    .populate('category')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product."
      });
    });
}


checkIfWinnerBought =()=>{
  const oneDay = (24 * 60 * 60 * 1000);
  const twoDays = 2 * (24 * 60 * 60 * 1000);

  const twoMin = 60 * 1000;
  const four = 60 * 1000;
  Product.find({isWinner:true, isPurshased:false, isPublic:false},'_id title raffleTime isPublic isPurshased isWinner UsersInRaffle UserWonRaffle')
    .then(data => {
      for(let i = 0; i < data.length; i++){
          if(data[i].raffleTime.valueOf() + oneDay <= Date.now()){
            console.log(data[i].raffleTime.valueOf() + "sprawdzaaaam")
            //data[i].raffleTime.valueof + oneDay
             //update product o tym id na raffle time +48h, i ustaw is winner:false, isPublic:true
             for(let k = 0; k < data[i].UserWonRaffle.length ; k++){
                User.findById(data[i].UserWonRaffle[k])
                  .then((user)=>{
                    user.ProductWonRaffle.pull(data[i]._id)
                    user.save()
                })
             }
              
              Product.updateOne({ _id: data[i]._id }
                ,{$set: { isPublic:true, isWinner:false, raffleTime: (Date.now() + twoDays), UsersWonRaffle: []  }}
              ).then(()=>{})
              notification.SendNotificationAddProducts(data[i].title, data[i]._id);
          }else 
            console.log("its ok")
      }
    })
    .catch(err => {
      console.log(err)
    });
}

//User.updateOne({_id:"636a49c6b2043cdd6f7e1a9f"}, {$set: { ProductWonRaffle: ProductWonRaffle.pull(data[i]._id)}}).then(()=>{})

// shedule work

const schedule = require('node-schedule');

schedule.scheduleJob('*/30 * * * * *', () =>{
    console.log('check user bought')
    checkIfWinnerBought();
    console.log('check raffle')

    Product.find({isPublic:true, isWinner:false, isPurshased:false},'_id title raffleTime isPublic isPurshased isWinner usersInRaffle')
    .then(data => {
      for(let i = 0; i < data.length; i++){
        console.log(data[i].raffleTime)
        if((data[i].raffleTime)<= Date.now() ){

            let random = {};
            console.log("test losuj" + data[i].title)
            // console.log("wylosuj" + data[i]._id)
                  Product.findById(data[i]._id)
                    .then((currentProduct) => {
                      if(currentProduct.isWinner === false){
                              if(currentProduct.usersInRaffle.length != 0){
                                  random = Math.floor(Math.random() * (currentProduct.usersInRaffle.length));
            
                                  User.findById(currentProduct.usersInRaffle[random]._id)
                                    .then((user)=>{
                                      if(currentProduct.usersInRaffle.includes(currentProduct.usersInRaffle[random]._id)){
                                            currentProduct.UserWonRaffle.push(currentProduct.usersInRaffle[random]._id)
                                            user.ProductWonRaffle.push(currentProduct.id)
                                            Product.updateOne({ _id:currentProduct._id }, {$set: { isWinner:true, isPublic:false } }).then(()=>{})
                                                        //add win notification to user 
                                                        const notification = new Notification({
                                                          content: "Gratulacje! wygrałeś loterie: "+ currentProduct.title ,
                                                          receiver: currentProduct.usersInRaffle[random]._id,
                                                          product: currentProduct._id
                                                        })
                                                        //save notification in database
                                                        notification.save(notification).then(() => {
                  
                                                          console.log("Gratulacje! user"+currentProduct.usersInRaffle[random]._id + "loterie: "+ currentProduct.title )
                                                        })
                                            /// 4 test
                                            console.log("ilosc w tablciy: " + currentProduct.usersInRaffle.length + " losowy: " 
                                                                  + random + "wylosowane id:" + currentProduct.usersInRaffle[random]._id )
                                          return user.save() && currentProduct.save()
                                      }else{
                                        console.log("cant find the user")
                                      }
                                    })
                              }else{
                                console.log("no one took part in the raffle" + data[i].title )
                              }
                      }else{
                        console.log("the product already has winners")
                      }
                  })


        }else{
          console.log("nieeeeee " + data[i].title)
        }
      }
    })
    .catch(err => {
      console.log(err)
    });


})



// FOR SS 
// schedule.scheduleJob('*/30 * * * * *', () =>{
//   //check user bought
//   checkIfWinnerBought();
//   //check raffle
//   Product.find({isPublic:true, isWinner:false, isPurshased:false},'_id title raffleTime isPublic isPurshased isWinner usersInRaffle')
//   .then(data => {
//     for(let i = 0; i < data.length; i++){
//       console.log(data[i].raffleTime)
//       if((data[i].raffleTime)<= Date.now() ){
//         let random = {};
//         Product.findById(data[i]._id)
//           .then((currentProduct) => {
//             if(currentProduct.isWinner === false){
//               if(currentProduct.usersInRaffle.length != 0){
//                 random = Math.floor(Math.random() * (currentProduct.usersInRaffle.length));
//                 User.findById(currentProduct.usersInRaffle[random]._id)
//                   .then((user)=>{
//                     if(currentProduct.usersInRaffle.includes(currentProduct.usersInRaffle[random]._id)){
//                       currentProduct.UserWonRaffle.push(currentProduct.usersInRaffle[random]._id)
//                       user.ProductWonRaffle.push(currentProduct.id)
//                       Product.updateOne({ _id:currentProduct._id }, {$set: { isWinner:true, isPublic:false } }).then(()=>{})
//                       notification.SendNotificationAddProducts( currentProduct.usersInRaffle[random]._id, currentProduct._id);
//                       return user.save() && currentProduct.save()
//                     }else{
//                       console.log("cant find the user")
//                     }
//                   })
//               }else{
//                 console.log("no one took part in the raffle" + data[i].title )
//               }
//             }else{
//               console.log("the product already has winners")
//             }
//           })
//       }else{
//         console.log("its no time yet" + data[i].title)
//       }
//     }
//   })
//   .catch(err => {
//     console.log(err)
//   });
// })


