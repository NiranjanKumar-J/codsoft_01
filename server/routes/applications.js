const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Application = require('../models/Application');
const Job = require('../models/Job');
const nodemailer = require('nodemailer');

// EMAIL CONFIGURATION
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jniranjankumar371@gmail.com', // 🔴 Replace with YOUR EMAIL
    pass: 'nqzcbzmekjpuepei'     // 🔴 Replace with YOUR APP PASSWORD
  }
});

// @route   GET api/applications/my-applications
// @desc    Get jobs applied by the logged-in candidate
// @access  Private (Candidate)
// ⚠️ IMPORTANT: Place this BEFORE the /:jobId route
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', ['title', 'company', 'location', 'salary']); 
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/applications/:jobId
// @desc    Apply for a job
router.post('/:jobId', [auth, upload.single('resume')], async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Check if already applied
    const existingApp = await Application.findOne({ job: jobId, candidate: req.user.id });
    if(existingApp) return res.status(400).json({ msg: 'You have already applied for this job' });

    const newApplication = new Application({
      job: jobId,
      candidate: req.user.id,
      resume: req.file.path
    });

    await newApplication.save();
    res.json({ msg: 'Application Submitted Successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/applications/:jobId
// @desc    Get applications for a specific job (Employer Only)
router.get('/:jobId', auth, async (req, res) => {
  try {
    // Check if the job belongs to the logged-in employer
    const job = await Job.findById(req.params.jobId);
    if (job.employer.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', ['name', 'email']);
    
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/applications/status/:appId
// @desc    Update Status & Send Email
router.put('/status/:appId', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const application = await Application.findById(req.params.appId)
            .populate('candidate', ['name', 'email'])
            .populate('job', ['title', 'company']);

        if (!application) return res.status(404).json({ msg: 'Application not found' });
        
        // Update Status
        application.status = status;
        await application.save();

        // 🔥 Email Notification Logic
        const mailOptions = {
            from: 'JobConnect Team <noreply@jobconnect.com>',
            to: application.candidate.email,
            subject: `Application Update: ${application.job.title}`,
            text: `Hello ${application.candidate.name},\n\nYour application for the position of "${application.job.title}" at ${application.job.company} has been ${status.toUpperCase()}.\n\nBest Regards,\nJobConnect Team`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.log('Email Error:', err);
            else console.log('Email Sent:', info.response);
        });
        
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;