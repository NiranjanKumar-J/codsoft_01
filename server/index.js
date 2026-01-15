const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

const app = express();

// Middleware
app.use(express.json());

// CORS Setup (Vercel-ku romba mukkiyam)
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('DB Connection Error:', err));

// Use Routes (Idhu unga file ah connect pannum)
app.use('/api/auth', authRoutes); 
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Job Board Backend is Running Live! 🚀');
});

// 👇 VERCEL SETUP (Idhu thaan mukkiyam)

// 1. Local-la run panna
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// 2. Vercel-ku export pannanum
module.exports = app;