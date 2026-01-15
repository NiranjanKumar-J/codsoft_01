const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Protection
const Job = require('../models/Job');

// @route   GET api/jobs/myjobs
// @desc    Get jobs posted by the logged-in employer
// @access  Private (Employer Only)
router.get('/myjobs', auth, async (req, res) => {
  try {
    // Current user post panna jobs mattum edukkom
    const jobs = await Job.find({ employer: req.user.id }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/jobs
// @desc    Create a new job
// @access  Private (Employer Only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is an Employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ msg: 'Access denied. Only employers can post jobs.' });
    }

    const { title, company, location, description, salary } = req.body;

    const newJob = new Job({
      title,
      company,
      location,
      description,
      salary,
      employer: req.user.id // Get Employer ID from token
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public (For Candidates)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 }); // Latest jobs first
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    // 1. Job irukka nu thedurom
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // 2. Security Check: Delete panravan dhaan indha job owner ah?
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this job' });
    }

    // 3. Delete Job
    await job.deleteOne();

    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;