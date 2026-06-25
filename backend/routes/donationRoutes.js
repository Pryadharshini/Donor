const express = require('express');
const Donation = require('../models/Donation');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Log a new donation
router.post('/', protect, async (req, res) => {
  try {
    const { hospital, date, bloodGroup, units } = req.body;
    const donation = new Donation({
      donorId: req.user._id,
      hospital,
      date,
      bloodGroup,
      units
    });
    const createdDonation = await donation.save();
    res.status(201).json(createdDonation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get logged in user's donations
router.get('/', protect, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id }).sort({ date: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
