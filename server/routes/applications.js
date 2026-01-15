const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Memory Storage
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

// =============================================
// 1. GET MY APPLICATIONS (Candidate View) 🙋‍♂️ [NEW ADDITION]
// =============================================
// ⚠️ இதுதான் முக்கியம்! இது '/:jobId' க்கு மேலே இருக்க வேண்டும்.
router.get('/my-applications', auth, async (req, res) => {
  try {
    // உள்நுழைந்த User (Candidate) அப்ளை செய்த வேலைகளை தேடுதல்
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company location salary status'); // Job Details-ஐ இணைத்தல்
      
    res.json(applications);
  } catch (err) {
    console.error("My Apps Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// =============================================
// 2. APPLY FOR A JOB (POST) 📝
// =============================================
router.post('/:jobId', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.params; 
    const { name, email, coverLetter } = req.body;

    const resumeName = req.file ? req.file.originalname : "resume_upload.pdf";

    // Check if already applied
    const existingApplication = await Application.findOne({ 
        job: jobId, 
        candidate: req.user.id 
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    // Save to Database
    const newApplication = new Application({
      job: jobId,
      candidate: req.user.id,
      name,
      email,
      resume: resumeName,
      coverLetter
    });

    await newApplication.save();

    // Send Email
    const mailOptions = {
        from: `JobConnect <${process.env.EMAIL_USER}>`,
        to: email, 
        subject: 'Application Received! 🚀',
        text: `Hello ${name},\n\nYour application has been successfully submitted! We will review it shortly.\n\nBest Regards,\nJobConnect Team`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log('❌ Email Error:', err);
    });

    res.json(newApplication);

  } catch (err) {
    console.error("App Error:", err.message);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// =============================================
// 3. GET APPLICATIONS FOR A JOB (Employer View) 👁️
// =============================================
router.get('/:jobId', auth, async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email'); 
      
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// =============================================
// 4. UPDATE STATUS (Accept/Reject) ✅❌
// =============================================
router.put('/status/:appId', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const application = await Application.findById(req.params.appId);
        if (!application) return res.status(404).json({ msg: 'Application not found' });
        
        application.status = status;
        await application.save();
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;