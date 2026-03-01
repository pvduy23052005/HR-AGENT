const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate', 
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  githubStars: {
    type: Number,
    default: 0
  },
  topLanguages: [{
    type: String 
  }],
  probedProjects: {
    type: mongoose.Schema.Types.Mixed 
  }
}, {
  timestamps: true
});

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;