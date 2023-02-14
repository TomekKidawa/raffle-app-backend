const products = require("../controllers/product.controller.js");
// var router = require("express").Router();


module.exports = app => {
    //for mod
    app.post("/api/products/add", products.create);
    app.get("/api/products/find", products.findAll);
    app.get("/api/products/find/:id", products.findOne);
    app.delete("/api/products/delete/:id", products.delete);
    app.put("/api/products/update/:id", products.update);
    app.get("/api/products/findpublic", products.findForModAllPublic);
    app.get("/api/products/findpurshased", products.findForModAllPurshased);
    app.get("/api/products/findiswinner", products.findForModAllIsWinner);
    app.get("/api/products/findallnonpublic", products.findForModAllNonPublic);
    app.post("/api/products/setpublic/:id", products.setPublic);
    
    //for all
    app.get("/api/products/findnopop/:id", products.findOneWithoutPop);
    app.get("/api/products/findallpublic", products.findAllpublic);
    app.get("/api/products/category/:id", products.findAllpublicByCategory);


    //raffle
    app.post("/api/products/removefromraffle/:id", products.removeUserFromRaffle);
    app.post("/api/products/addtoraffle/:id", products.addUserToRaffle);

    //draw the winner 
    app.post("/api/products/drawthewinner/:id", products.drawTheWinner);
    app.post("/api/products/resetwinner", products.resetWinner);


    //find for Profle
    app.get("/api/products/profile/currentraffles/:id", products.findForCurrentRaffles);


  };