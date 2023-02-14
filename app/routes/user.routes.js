const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const user = require("../controllers/user.controller.js"); //for User menagement


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get("/api/test/mod",[authJwt.verifyToken, authJwt.isModerator],controller.moderatorBoard);
  app.get("/api/test/admin",[authJwt.verifyToken, authJwt.isAdmin],controller.adminBoard);

  // user menagement
  app.get("/api/admin/getusers", user.findAll);
  app.get("/api/admin/getusers/:id", user.findOne);
  app.put("/api/admin/edituser/:id", user.update);
  app.delete("/api/admin/deleteuser/:id", user.delete);
  
  

};