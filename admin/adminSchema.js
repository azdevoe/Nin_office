let mongoose = require('mongoose');
const validator = require('validator');

const admin = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required:true
  },
  Nin: {
    type: Number,
    required: true,
    unique: true
  },

roles:{
    type: String,
    default:'admin'

}




}, {
  select: {
    _id: 0,
    __v: 0
  }
})

const User = mongoose.model('admin', admin);



module.exports = User

