let mongoose = require('mongoose');
const validator = require('validator');

const yy = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  Nin: {
    type: Number,
    required: true,
    unique: true
  },
 email: {
  type: String,
  required: true,
  validate: [
    {
      validator: function(email) {
        return validator.isEmail(email);
      },
      message: 'Invalid email address'
    }
  ]
}
,

hobbies: {
    type: [String],
  }
}, {
  select: {
    _id: 0,
    __v: 0
  }
})

const User = mongoose.model('user', yy);



module.exports = User

