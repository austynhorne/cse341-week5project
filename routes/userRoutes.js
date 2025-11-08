const express = require('express');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const { isAuthenticated } = require('../middleware/authMiddleware');
const passport = require('passport');
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

const manualUserValidators = [
  body('username').trim().notEmpty().withMessage('username is required'),
  body('email').isEmail().withMessage('valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
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
  isAuthenticated,
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
  isAuthenticated,
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

// Manual registration
router.post('/register', manualUserValidators, handleValidationErrors, async (req, res, next) => {
  try {
    const { username, email, password, profilePic, favoriteSpecies } = req.body;
    const user = new User({
      username,
      email,
      password,
      profilePic,
      favoriteSpecies
    });
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    next(err);
  }
});

router.post('/login', [
  body('email').isEmail().withMessage('valid email is required'),
  body('password').notEmpty().withMessage('password is required')
], handleValidationErrors, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json(user);
    });
  } catch (err) { next(err); }
});

// GET all users (admin only)
router.get('/admin/all', isAuthenticated, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const users = await User.find();
    res.json(users);
  } catch (err) { next(err); }
});

module.exports = router;
