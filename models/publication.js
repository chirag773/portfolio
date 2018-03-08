
var mongoose = require('mongoose');
var publicationSchema = new mongoose.Schema({
  
  description:String
  
});

module.exports = mongoose.model("Publication", publicationSchema)