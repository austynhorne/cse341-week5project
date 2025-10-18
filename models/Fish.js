const mongoose = require('mongoose');

const fishSchema = new mongoose.Schema({
  species: { type: String, required: true },
  river: { type: String, required: true },
  weightOz: { type: Number, required: true },
  lengthIn: { type: Number, required: true },
  lureUsed: { type: String, required: true },
  catchDate: { type: Date, default: Date.now },
  notes: { type: String },
  caughtBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Fish', fishSchema);
