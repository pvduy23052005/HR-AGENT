const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
  fullName: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  avatar: { type: String, trim: true },
  cvLink: { type: String, trim: true },
  githubLink: { type: String, trim: true },
  socialLinks: { type: Object } 
}, { _id: false }); 

const educationSchema = new mongoose.Schema({
  school: { type: String, trim: true },
  degree: { type: String, trim: true },
  major: { type: String, trim: true },
  gpa: { type: String, trim: true },
  period: { type: String, trim: true }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: { type: String, trim: true },
  position: { type: String, trim: true },
  duration: { type: String, trim: true },
  description: { type: String, trim: true },
  techStack: [{ type: String, trim: true }], 
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  techStack: [{ type: String, trim: true }],
  projectLink: { type: String, trim: true }
}, { _id: false });


const candidateSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', 
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  status: {
    type: Boolean, 
    default: true
  },
  objective: {
    type: String,
    trim: true
  },
  fullTextContent: {
    type: String, 
    trim: true
  },
  

  personal: personalSchema,
  educations: [educationSchema],
  experiences: [experienceSchema],
  projects: [projectSchema]
  
}, {
  timestamps: true 
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;