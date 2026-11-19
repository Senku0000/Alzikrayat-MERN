require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alzikrayat';

// ---------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded photo files statically, e.g. GET /uploads/photo_123.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------------------------------------------------
// API routes
// ---------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Unknown route fallback
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Centralized error handler (must be registered last)
app.use(errorHandler);

// ---------------------------------------------------------------
// Connect to MongoDB, then start listening
// ---------------------------------------------------------------
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Alzikrayat API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
