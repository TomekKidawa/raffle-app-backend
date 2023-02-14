const notification = require("../controllers/notification.controller.js");

module.exports = app => {

    app.post("/api/notification/add", notification.create);
    app.get("/api/notification/find", notification.findAll);
    app.delete("/api/notification/deleteall", notification.deleteAll);
    app.post("/api/notification/findalltospec", notification.findAllToSpecificUser);
    app.post("/api/notification/addenter", notification.AddNotificationEnter);
    app.post("/api/notification/addexit", notification.AddNotificationExit);
    
  };