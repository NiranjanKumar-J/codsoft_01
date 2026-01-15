const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Config
dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // JSON Data-va purinjika
app.use(cors()); // Frontend & Backend connect aaga

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop app if DB fails
  }
};

// Connect DB immediately
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
// app.use('/api/applications', require('./routes/applications')); // Iruntha enable panniko

// Default Route (To check if server is alive)
app.get('/', (req, res) => {
  res.send("API is Running Live! 🚀");
});

// 👇 VERCEL SETUP (Rendu vishayam mukkiyam)

// 1. Local-la run panna idhu help pannum
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running locally on port ${PORT}`));
}

// 2. Vercel-ku "App"-a export pannanum
module.exports = app;