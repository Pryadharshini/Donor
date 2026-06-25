const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  hospital: { type: String, required: true },
  units: { type: Number, required: true },
  urgency: { type: String, enum: ['Normal', 'Urgent', 'Critical'], required: true },
  contact: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ['Active', 'Fulfilled', 'Cancelled'], default: 'Active' },
  city: { type: String },
  stateCode: { type: String, required: true },
  countryCode: { type: String, required: true, default: 'IN' },
  taluk: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
