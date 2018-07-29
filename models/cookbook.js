var mongoose = require("mongoose");

var CookbookSchema = mongoose.Schema({
    name:                       String,
    category:                   String,
    image:                      String,
    aptFor:                     String,
    target:                     String,
    foodContents:               String,
    price:                      Number
});

module.exports = mongoose.model("Cookbook", CookbookSchema);