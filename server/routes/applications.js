const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 
const Application = require('../models/Application');
const nodemailer = require('nodemailer');

// 🔐 EMAIL CONFIGURATION (Safe Mode)
// இப்போ பாஸ்வேர்ட் இங்க இருக்காது, Vercel செட்டிங்ஸ்ல இருந்து வரும்.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // 👈 ரகசியமா இங்க வரும்
    pass: process.env.EMAIL_PASS  // 👈 ரகசியமா இங்க வரும்
  }
});

// ---------------------------------------------
// POST: Apply for a Job + Send Email 📨
// ---------------------------------------------
router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, name, email, coverLetter } = req.body;

    // Vercel Fix: Path இல்லாததால் File Name எடுக்கிறோம்
    const resumeName = req.file ? req.file.originalname : "resume_upload.pdf";

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, userId: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    // Save to Database
    const newApplication = new Application({
      jobId,
      userId: req.user.id,
      name,
      email,
      resume: resumeName,
      coverLetter
    });

    await newApplication.save();

    // 📨 EMAIL LOGIC: User-க்கு மெயில் அனுப்புதல்
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