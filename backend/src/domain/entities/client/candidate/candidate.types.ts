export enum CandidateStatus {
  APPLIED = "applied",
  SCREENING = "screening",
  INTERVIEW = "interview",
  OFFER = "offer",
}

export enum VerificationStatus {
  UNVERIFIED = "unverified",
  VERIFIED = "verified",
  RISKY = "risky",
}

export interface IPersonal {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  cvLink: string;
  githubLink: string;
  socialLinks: Record<string, string>;
}

export interface IEducation {
  school: string;
  degree: string;
  major: string;
  gpa: string;
  period: string;
}

export interface IExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
  techStack: string[];
}

export interface IProject {
  title: string;
  description: string;
  techStack: string[];
  projectLink: string;
}

export interface ICandidateSummaryProfile {
  id: string | null;
  jobID: string | null;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  cvLink: string;
  topSkills: string[];
  duration: string;
  isVerify?: boolean;
  status: CandidateStatus;
  verificationStatus: VerificationStatus;
  appliedAt: Date | undefined;
}

export interface ICandidateDetailProfile {
  id: string | null;
  jobID: string | null;
  addedBy: string | null;
  status: CandidateStatus;
  verificationStatus: VerificationStatus;
  objective: string;
  personal: IPersonal;
  educations: IEducation[];
  experiences: IExperience[];
  projects: IProject[];
  allSkills: string[];
  duration: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export interface ICandidateProps {
  id?: string | { toString(): string } | null;
  jobID?: string | { toString(): string } | null;
  jobTitle?: string;
  addedBy?: string | { toString(): string } | null;
  status: CandidateStatus;
  verificationStatus?: VerificationStatus;
  objective?: string;
  fullTextContent?: string;
  isVerify?: boolean;
  personal?: Partial<IPersonal>;
  educations?: Partial<IEducation>[];
  experiences?: Partial<IExperience>[];
  projects?: Partial<IProject>[];
  createdAt?: Date;
  updatedAt?: Date;
}
