const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.String,
  },
  poll_id: {
    type: mongoose.Schema.Types.String,
  },
  item_voted: {
    type: mongoose.Schema.Types.String,
  },
  canVote: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
});

const VoteRegistry = mongoose.model('Vote', voteSchema);

module.exports = VoteRegistry;
