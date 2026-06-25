const express = require('express');
const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d',
  });
};

// Register Donor
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    const donorExists = await Donor.findOne({ email });

    if (donorExists) {
      return res.status(400).json({ message: 'Donor with this email already exists' });
    }

    const donor = await Donor.create(req.body);

    if (donor) {
      res.status(201).json({
        _id: donor._id,
        fullName: donor.fullName,
        email: donor.email,
        role: donor.role,
        token: generateToken(donor._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid donor data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Donor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const donor = await Donor.findOne({ email });

    if (donor && (await donor.matchPassword(password))) {
      res.json({
        _id: donor._id,
        fullName: donor.fullName,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
        role: donor.role,
        token: generateToken(donor._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search Donors
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, state, city, taluk } = req.query;
    const query = { isAvailable: true };

    if (bloodGroup) query.bloodGroup = bloodGroup;
    // state is currently stored as stateCode in DB, but the frontend might pass state name or code.
    // Let's assume we search by city and taluk using regex for partial matches
    if (city) query.city = { $regex: city, $options: 'i' };
    if (taluk) query.taluk = { $regex: taluk, $options: 'i' };

    const donors = await Donor.find(query).select('-password');
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User Profile
router.get('/profile', protect, async (req, res) => {
  try {
    const donor = await Donor.findById(req.user._id).select('-password');
    if (donor) {
      res.json(donor);
    } else {
      res.status(404).json({ message: 'Donor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User Profile
router.put('/profile', protect, async (req, res) => {
  try {
    const donor = await Donor.findById(req.user._id);

    if (donor) {
      donor.fullName = req.body.fullName || donor.fullName;
      donor.age = req.body.age || donor.age;
      donor.mobile = req.body.mobile || donor.mobile;
      donor.email = req.body.email || donor.email;
      donor.city = req.body.city || donor.city;
      donor.taluk = req.body.taluk || donor.taluk;
      
      if (req.body.isAvailable !== undefined) {
        donor.isAvailable = req.body.isAvailable;
      }

      const updatedDonor = await donor.save();

      res.json({
        _id: updatedDonor._id,
        fullName: updatedDonor.fullName,
        email: updatedDonor.email,
        mobile: updatedDonor.mobile,
        city: updatedDonor.city,
        taluk: updatedDonor.taluk,
        isAvailable: updatedDonor.isAvailable,
        token: generateToken(updatedDonor._id), // Optionally return token if needed
      });
    } else {
      res.status(404).json({ message: 'Donor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, mobile, newPassword } = req.body;
    
    if (!email || !mobile || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, mobile, and new password.' });
    }

    // Verify identity
    const donor = await Donor.findOne({ email, mobile });
    if (!donor) {
      return res.status(401).json({ message: 'Invalid email or mobile number.' });
    }

    // Update password (pre-save hook will hash it)
    donor.password = newPassword;
    await donor.save();

    res.json({ message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
