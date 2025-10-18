const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const fishSchema = new mongoose.Schema({
  species: { type: String, required: true },
  river: { type: String, required: true },
  weightOz: { type: Number, required: true },
  notes: { type: String },
  dateCaught: { type: Date, default: Date.now },
  method: { type: String },
  user: { type: String } // email from OAuth
});

const Fish = mongoose.model('Fish', fishSchema);

// GET all fish
router.get('/', async (req, res) => {
  try {
    const allFish = await Fish.find();
    res.json(allFish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET fish by ID
router.get('/:id', async (req, res) => {
  try {
    const fish = await Fish.findById(req.params.id);
    if (!fish) return res.status(404).json({ message: 'Fish not found' });
    res.json(fish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new fish
router.post('/', async (req, res) => {
  const { species, river, weightOz, notes, method, user } = req.body;
  if (!species || !river || !weightOz) return res.status(400).json({ message: 'species, river, and weightOz are required' });
  const newFish = new Fish({ species, river, weightOz, notes, method, user });
  try {
    const savedFish = await newFish.save();
    res.status(201).json(savedFish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update fish by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedFish = await Fish.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedFish) return res.status(404).json({ message: 'Fish not found' });
    res.json(updatedFish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE fish by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedFish = await Fish.findByIdAndDelete(req.params.id);
    if (!deletedFish) return res.status(404).json({ message: 'Fish not found' });
    res.json({ message: 'Fish deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
