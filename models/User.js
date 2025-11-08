const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  oauthProvider: { type: String },
  oauthId: { type: String },
  profilePic: { type: String },
  joinDate: { type: Date, default: Date.now },
  favoriteSpecies: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
