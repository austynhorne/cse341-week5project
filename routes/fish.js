const express = require('express');
const router = express.Router();
const Fish = require('../models/Fish');
const { isAuthenticated } = require('../middleware/authMiddleware');

const validateFish = (data) => {
  const requiredFields = ['species','river','weightOz','lengthIn','lureUsed','caughtBy'];
  for (let field of requiredFields) {
    if (!data[field]) return `${field} is required`;
  }
  return null;
};

// CRUD routes with validation and error handling
router.get('/', async (req, res) => {
  try { res.json(await Fish.find().populate('caughtBy','username email')); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const fish = await Fish.findById(req.params.id).populate('caughtBy','username email');
    if (!fish) return res.status(404).json({ error: 'Fish not found' });
    res.json(fish);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', isAuthenticated, async (req, res) => {
  const error = validateFish(req.body);
  if (error) return res.status(400).json({ error });
  try { res.status(201).json(await new Fish(req.body).save()); } 
  catch(err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const fish = await Fish.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!fish) return res.status(404).json({ error: 'Fish not found' });
    res.json(fish);
  } catch(err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const fish = await Fish.findByIdAndDelete(req.params.id);
    if (!fish) return res.status(404).json({ error: 'Fish not found' });
    res.json({ message: 'Fish deleted successfully' });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
