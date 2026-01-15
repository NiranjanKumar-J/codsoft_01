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
router.post('/:jobId', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.params; 
    const { name, email, coverLetter } = req.body;

    const resumeName = req.file ? req.file.originalname : "resume_upload.pdf";

    // 👇 மாற்றம் 1: 'jobId' & 'userId' க்கு பதில் 'job' & 'candidate'
    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, candidate: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    // 👇 மாற்றம் 2: Database-ல் சேவ் செய்யும் போது சரியான பெயர்கள்
    const newApplication = new Application({
      job: jobId,              // Database Field: 'job'
      candidate: req.user.id,  // Database Field: 'candidate'
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
    res.status(500).send('App Error: ' + err.message);
  }
});

// ---------------------------------------------
// GET: View Applications (Employer Only)
// ---------------------------------------------
router.get('/:jobId', auth, async (req, res) => {
  try {
    // இங்கயும் query பண்ணும்போது 'job' னு மாத்தணும்
    const applications = await Application.find({ job: req.params.jobId });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;