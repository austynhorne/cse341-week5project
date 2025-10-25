// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./passport-config');
const fishRoutes = require('./routes/fishRoutes');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'flyfishsecret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Root
app.get('/', (req, res) => res.send('Fly Fishing API'));

// OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Redirect to homepage after login
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// REST API routes
app.use('/api/fish', fishRoutes);
app.use('/api/users', userRoutes);

// Swagger docs
let swaggerDocument = {};
try {
  swaggerDocument = require('./swagger.json');
} catch (err) {
  console.warn('swagger.json missing');
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(`MongoDB connected to DB: ${process.env.DB_NAME || 'default'}`))
.catch(err => { console.error('DB error', err); process.exit(1); });

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
