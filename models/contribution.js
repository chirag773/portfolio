
var mongoose = require('mongoose');
var contributionSchema = new mongoose.Schema({
  
  contribution:String
  
});

module.exports = mongoose.model("Contribution", contributionSchema)