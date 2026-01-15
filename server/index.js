const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Path module add pannirukom
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications'); // NEW: Application Route

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// IMPORTANT: Make 'uploads' folder public so we can view resumes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('DB Connection Error:', err));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes); // NEW: Connect Application API

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Job Board Backend is Running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});