const category = require("../controllers/category.controller.js");


module.exports = app => {

    app.post("/api/category/add", category.create);
    app.get("/api/category/find", category.findAll);
    app.delete("/api/category/deleteone/:id", category.delete);
    
  };