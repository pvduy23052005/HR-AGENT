import mongoose, { Document, Types } from 'mongoose';

interface IPersonalDoc {
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  cvLink?: string;
  githubLink?: string;
  socialLinks?: Record<string, string>;
}

interface IEducationDoc {
  school?: string;
  degree?: string;
  major?: string;
  gpa?: string;
  period?: string;
}

interface IExperienceDoc {
  company?: string;
  position?: string;
  duration?: string;
  description?: string;
  techStack?: string[];
}

interface IProjectDoc {
  title?: string;
  description?: string;
  techStack?: string[];
  projectLink?: string;
}

export interface ICandidateDocument extends Document {
  jobID: Types.ObjectId;
  addedBy: Types.ObjectId;
  status: boolean;
  objective: string;
  fullTextContent: string;
  personal: IPersonalDoc;
  educations: IEducationDoc[];
  experiences: IExperienceDoc[];
  projects: IProjectDoc[];
  createdAt: Date;
  updatedAt: Date;
}

const personalSchema = new mongoose.Schema<IPersonalDoc>(
  {
    fullName: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String, trim: true },
    cvLink: { type: String, trim: true },
    githubLink: { type: String, trim: true },
    socialLinks: { type: Object },
  },
  { _id: false },
);

const educationSchema = new mongoose.Schema<IEducationDoc>(
  {
    school: { type: String, trim: true },
    degree: { type: String, trim: true },
    major: { type: String, trim: true },
    gpa: { type: String, trim: true },
    period: { type: String, trim: true },
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema<IExperienceDoc>(
  {
    company: { type: String, trim: true },
    position: { type: String, trim: true },
    duration: { type: String, trim: true },
    description: { type: String, trim: true },
    techStack: [{ type: String, trim: true }],
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema<IProjectDoc>(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    techStack: [{ type: String, trim: true }],
    projectLink: { type: String, trim: true },
  },
  { _id: false },
);

const candidateSchema = new mongoose.Schema<ICandidateDocument>(
  {
    jobID: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: Boolean, default: true },
    objective: { type: String, trim: true },
    fullTextContent: { type: String, trim: true },
    personal: personalSchema,
    educations: [educationSchema],
    experiences: [experienceSchema],
    projects: [projectSchema],
  },
  { timestamps: true },
);

const Candidate = mongoose.model<ICandidateDocument>('Candidate', candidateSchema);

export default Candidate;
