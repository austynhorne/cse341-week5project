const express = require('express');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const User = require('../models/User');

const router = express.Router();

const userValidators = [
  body('username').trim().notEmpty().withMessage('username is required'),
  body('email').isEmail().withMessage('valid email is required'),
  body('oauthProvider').trim().notEmpty().withMessage('oauthProvider is required'),
  body('oauthId').trim().notEmpty().withMessage('oauthId is required'),
  body('profilePic').optional().isString(),
  body('favoriteSpecies').optional().isString()
];

// GET all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) { next(err); }
});

// GET user by ID
router.get('/:id', param('id').isMongoId().withMessage('Invalid id'), handleValidationErrors, async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    res.json(u);
  } catch (err) { next(err); }
});

// POST create user
router.post('/', userValidators, handleValidationErrors, async (req, res, next) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) { 
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    next(err);
  }
});

// PUT update user
router.put('/:id',
  param('id').isMongoId().withMessage('Invalid id'),
  userValidators,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'User not found' });
      res.json(updated);
    } catch (err) { next(err); }
  }
);

// DELETE user
router.delete('/:id',
  param('id').isMongoId().withMessage('Invalid id'),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const deleted = await User.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User deleted' });
    } catch (err) { next(err); }
  }
);

module.exports = router;
