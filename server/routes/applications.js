const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Memory Storage
const Application = require('../models/Application');
const nodemailer = require('nodemailer');

// 🔐 EMAIL CONFIGURATION
// Vercel Settings-ல் EMAIL_USER மற்றும் EMAIL_PASS இருப்பதை உறுதி செய்யவும்.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// =============================================
// 1. APPLY FOR A JOB (POST) 📝
// =============================================
router.post('/:jobId', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.params; 
    const { name, email, coverLetter } = req.body;

    // Vercel Fix: Path கிடைக்காது, அதனால் File Name-ஐ எடுக்கிறோம்
    const resumeName = req.file ? req.file.originalname : "resume_upload.pdf";

    // 1. Check if already applied (Using 'job' and 'candidate')
    const existingApplication = await Application.findOne({ 
        job: jobId, 
        candidate: req.user.id 
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    // 2. Save to Database (Using correct schema names)
    const newApplication = new Application({
      job: jobId,              // Schema Field: 'job'
      candidate: req.user.id,  // Schema Field: 'candidate'
      name,
      email,
      resume: resumeName,
      coverLetter
    });

    await newApplication.save();

    // 3. Send Confirmation Email 📨
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
    res.status(500).send('Server Error: ' + err.message);
  }
});

// =============================================
// 2. GET APPLICATIONS FOR A JOB (Employer View) 👁️
// =============================================
router.get('/:jobId', auth, async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      // 👇 IMPORTANT FIX: இதுதான் Candidate பெயர் & ஈமெயிலை எடுத்து வரும்!
      .populate('candidate', 'name email'); 
      
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// =============================================
// 3. UPDATE STATUS (Accept/Reject) ✅❌
// =============================================
router.put('/status/:appId', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const application = await Application.findById(req.params.appId);
        
        if (!application) return res.status(404).json({ msg: 'Application not found' });
        
        // Update Status
        application.status = status;
        await application.save();

        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;