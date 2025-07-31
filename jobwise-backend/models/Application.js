// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'reviewed', 'accepted', 'rejected'],
    default: 'applied',
  },
  message: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
