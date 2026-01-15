const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 
const Application = require('../models/Application');
const nodemailer = require('nodemailer');

// 🔐 EMAIL CONFIGURATION
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ---------------------------------------------
// POST: Apply for a Job + Send Email 📨
// ---------------------------------------------
// 👇 மாற்றம் இங்கே தான்: '/:jobId' என்று இருக்க வேண்டும்!
router.post('/:jobId', auth, upload.single('resume'), async (req, res) => {
  try {
    // 1. Get Job ID from URL (Frontend அனுப்புவது போல)
    const { jobId } = req.params; 
    
    // 2. Get other data from Body
    const { name, email, coverLetter } = req.body;

    // Vercel Fix: Path இல்லாததால் File Name எடுக்கிறோம்
    const resumeName = req.file ? req.file.originalname : "resume_upload.pdf";

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, userId: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    // Save to Database
    const newApplication = new Application({
      jobId, // URL-லிருந்து வந்த ID
      userId: req.user.id,
      name,
      email,
      resume: resumeName,
      coverLetter
    });

    await newApplication.save();

    // 📨 EMAIL LOGIC
    const mailOptions = {
        from: `JobConnect <${process.env.EMAIL_USER}>`,
        to: email, 
        subject: 'Application Received! 🚀',
        text: `Hello ${name},\n\nYour application has been successfully submitted! We will review it shortly.\n\nBest Regards,\nJobConnect Team`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log('❌ Email Error:', err);
        else console.log('✅ Email Sent:', info.response);
    });

    res.json(newApplication);

  } catch (err) {
    console.error("App Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// ---------------------------------------------
// GET: View Applications (Employer Only)
// ---------------------------------------------
router.get('/:jobId', auth, async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;