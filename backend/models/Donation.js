const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  units: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Cancelled'],
    default: 'Completed',
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
