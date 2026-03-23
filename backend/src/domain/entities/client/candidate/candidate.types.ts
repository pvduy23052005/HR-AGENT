export enum CandidateStatus {
  UNVERIFIED = "unverified",
  SCHEDULED = "scheduled",
  VERIFIED = "verified",
  RISKY = "risky",
  APPLIED = "applied",
  SCREENING = "screening",
  INTERVIEW = "interview",
  OFFER = "offer",
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
  fullName: string;
  email: string;
  phone: string;
  cvLink: string;
  topSkills: string[];
  isVerify?: boolean;
  status: CandidateStatus;
  appliedAt: Date | undefined;
}

export interface ICandidateDetailProfile {
  id: string | null;
  jobID: string | null;
  addedBy: string | null;
  status: CandidateStatus;
  objective: string;
  personal: IPersonal;
  educations: IEducation[];
  experiences: IExperience[];
  projects: IProject[];
  allSkills: string[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export interface ICandidateProps {
  id?: string | { toString(): string } | null;
  jobID?: string | { toString(): string } | null;
  addedBy?: string | { toString(): string } | null;
  status: CandidateStatus;
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
