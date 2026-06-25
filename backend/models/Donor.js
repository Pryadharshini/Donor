const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String },
  countryCode: { type: String, required: true },
  stateCode: { type: String, required: true },
  city: { type: String, required: true },
  taluk: { type: String, required: true },
  lastDonation: { type: Date },
  agreeTerms: { type: Boolean, required: true },
  agreeContact: { type: Boolean, required: true },
  isAvailable: { type: Boolean, default: true },
  role: { type: String, enum: ['donor', 'admin'], default: 'donor' }
}, { timestamps: true });

// Hash password before saving
donorSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
donorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Donor', donorSchema);
