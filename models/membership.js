var mongoose = require('mongoose');
var membershipSchema = new mongoose.Schema({
  
  membership:String
  
});

module.exports = mongoose.model("Membership", membershipSchema)