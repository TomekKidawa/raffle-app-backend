const payment = require('../controllers/payment.controller.js')
const { authJwt } = require("../middlewares");

module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

   // app.post("/api/payment/checkout",[authJwt.verifyToken], payment.create);
    app.post("/api/payment/create", payment.create);
   
  };