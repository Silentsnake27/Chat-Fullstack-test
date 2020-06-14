const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChatSchema = new Schema({
  user: String,
  msg: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', ChatSchema);
