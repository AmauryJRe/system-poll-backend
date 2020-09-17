const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  name: String,
  fullName: String,
  password: String,
  avatar: {
    data: Buffer,
    contentType: String,
  },
  role: {
    type: String,
    default: 'user',
  },
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;
