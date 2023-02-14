const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); //pagination
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshToken.model");
db.products = require("./product.model")(mongoose, mongoosePaginate); //product
db.categories = require("./category.model"); //product categories
db.notifications = require("./notification.model");
db.orders = require("./order.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;

