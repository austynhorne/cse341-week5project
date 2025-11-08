const express = require('express');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const { isAuthenticated } = require('../middleware/authMiddleware');
const Fish = require('../models/Fish');

const router = express.Router();

const fishValidators = [
  body('species').trim().notEmpty().withMessage('species is required'),
  body('river').trim().notEmpty().withMessage('river is required'),
  body('weightOz').isNumeric().withMessage('weightOz must be a number'),
  body('lengthIn').isNumeric().withMessage('lengthIn must be a number'),
  body('lureUsed').trim().notEmpty().withMessage('lureUsed is required'),
  body('caughtBy').isMongoId().withMessage('caughtBy must be a valid user ID'),
  body('notes').optional().isString()
];

router.get('/', async (req, res, next) => {
  try {
    const fish = await Fish.find();
    res.json(fish);
  } catch (err) { next(err); }
});

router.get('/:id',
  param('id').isMongoId().withMessage('Invalid id'),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const f = await Fish.findById(req.params.id);
      if (!f) return res.status(404).json({ error: 'Fish not found' });
      res.json(f);
    } catch (err) { next(err); }
  }
);

router.post('/', isAuthenticated, fishValidators, handleValidationErrors, async (req, res, next) => {
  try {
    const newFish = new Fish(req.body);
    const saved = await newFish.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
});

router.put('/:id',
  isAuthenticated,
  param('id').isMongoId().withMessage('Invalid id'),
  fishValidators,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const updated = await Fish.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Fish not found' });
      res.json(updated);
    } catch (err) { next(err); }
  }
);

router.delete('/:id',
  isAuthenticated,
  param('id').isMongoId().withMessage('Invalid id'),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const deleted = await Fish.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Fish not found' });
      res.json({ message: 'Fish deleted' });
    } catch (err) { next(err); }
  }
);

module.exports = router;
