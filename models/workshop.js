
var mongoose = require('mongoose');
var workshopSchema = new mongoose.Schema({
  
  workshop:String
  
});

module.exports = mongoose.model("Workshop", workshopSchema)