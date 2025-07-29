const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
