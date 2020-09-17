const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  options: {
    type: {},
    of: Number,
  },
  closed: {
    type: Boolean,
    default: false,
  },
});

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;
