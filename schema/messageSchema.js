const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  messages: [{
    date: Date,
    message: [String]
  }]
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message