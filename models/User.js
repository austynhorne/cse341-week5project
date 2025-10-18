const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  oauthProvider: { type: String, required: true },
  oauthId: { type: String, required: true },
  profilePic: { type: String },
  joinDate: { type: Date, default: Date.now },
  favoriteSpecies: { type: String }
});

module.exports = mongoose.model('User', userSchema);
