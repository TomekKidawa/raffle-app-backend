const order = require("../controllers/order.controller.js");


module.exports = app => {

    app.post("/api/order/add", order.create);
    app.get("/api/order/find", order.findAll);
    app.get("/api/order/findalltospec/:id", order.findAllToSpecificUser);
    app.get("/api/order/findone/:id", order.findOne);
    app.delete("/api/order/deleteone/:id", order.delete);
    app.put("/api/order/edit/:id", order.update);
    app.delete("/api/order/deleteall", order.deleteAll);
  };