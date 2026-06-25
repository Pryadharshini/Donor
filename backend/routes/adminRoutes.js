const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all donors
router.get('/donors', protect, admin, async (req, res) => {
  try {
    const donors = await Donor.find({}).select('-password');
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a donor
router.delete('/donors/:id', protect, admin, async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json({ message: 'Donor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all blood requests
router.get('/requests', protect, admin, async (req, res) => {
  try {
    const requests = await BloodRequest.find({});
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a blood request
router.delete('/requests/:id', protect, admin, async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments({});
    
    // Calculate new donors this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newDonorsThisMonth = await Donor.countDocuments({ createdAt: { $gte: startOfMonth } });

    const activeRequests = await BloodRequest.countDocuments({ status: 'Active' });
    const fulfilledRequests = await BloodRequest.countDocuments({ status: 'Fulfilled' });

    // Blood group analytics
    const bloodGroupCounts = await Donor.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ]);

    const formattedAnalytics = bloodGroupCounts.map(bg => ({
      group: bg._id,
      count: bg.count,
      percentage: totalDonors ? Math.round((bg.count / totalDonors) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    res.json({
      totalDonors,
      activeRequests,
      fulfilledRequests,
      newDonorsThisMonth,
      bloodGroupAnalytics: formattedAnalytics
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
