require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./passport-config');
const fishRoutes = require('./routes/fish');
const userRoutes = require('./routes/users');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('DB error', err); process.exit(1); });

app.get('/', (req, res) => res.send('Fly Fishing API'));

// OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req,res)=>res.redirect('/'));

// API routes
app.use('/api/fish', fishRoutes);
app.use('/api/users', userRoutes);

// Swagger docs
let swaggerDocument = {};
try { swaggerDocument = require('./swagger.json'); } catch(err){ console.warn('swagger.json missing'); }
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
