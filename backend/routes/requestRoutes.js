const express = require('express');
const BloodRequest = require('../models/BloodRequest');
const router = express.Router();

// Create a blood request
router.post('/', async (req, res) => {
  try {
    const request = await BloodRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all active blood requests
router.get('/', async (req, res) => {
  try {
    // Sort by createdAt descending
    const requests = await BloodRequest.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
