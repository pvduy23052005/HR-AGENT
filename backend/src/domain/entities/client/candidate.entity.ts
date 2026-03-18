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

export class CandidateEntity {
  id: string | null;
  jobID: string | null;
  addedBy: string | null;
  status: CandidateStatus;
  objective: string;
  isVerify?: boolean;
  fullTextContent: string;
  personal: IPersonal;
  educations: IEducation[];
  experiences: IExperience[];
  projects: IProject[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor({
    id,
    jobID,
    addedBy,
    status = CandidateStatus.UNVERIFIED,
    objective = '',
    isVerify,
    fullTextContent = '',
    personal = {},
    educations = [],
    experiences = [],
    projects = [],
    createdAt,
    updatedAt,
  }: ICandidateProps) {
    this.id = id ? id.toString() : null;
    this.jobID = jobID ? jobID.toString() : null;
    this.addedBy = addedBy ? addedBy.toString() : null;
    this.status = status;
    this.objective = objective;
    this.fullTextContent = fullTextContent;
    this.isVerify = isVerify;

    this.personal = {
      fullName: personal.fullName ?? '',
      email: personal.email ?? '',
      phone: personal.phone ?? '',
      avatar: personal.avatar ?? '',
      cvLink: personal.cvLink ?? '',
      githubLink: personal.githubLink ?? '',
      socialLinks: personal.socialLinks ?? {},
    };

    this.educations = educations.map((edu) => ({
      school: edu.school ?? '',
      degree: edu.degree ?? '',
      major: edu.major ?? '',
      gpa: edu.gpa ?? '',
      period: edu.period ?? '',
    }));

    this.experiences = experiences.map((exp) => ({
      company: exp.company ?? '',
      position: exp.position ?? '',
      duration: exp.duration ?? '',
      description: exp.description ?? '',
      techStack: exp.techStack ?? [],
    }));

    this.projects = projects.map((proj) => ({
      title: proj.title ?? '',
      description: proj.description ?? '',
      techStack: proj.techStack ?? [],
      projectLink: proj.projectLink ?? '',
    }));

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getAllTechStacks(): string[] {
    const expTechs = this.experiences.flatMap((exp) => exp.techStack ?? []);
    const projTechs = this.projects.flatMap((proj) => proj.techStack ?? []);
    const allTechs = [...expTechs, ...projTechs];
    const setTechs = [...new Set(allTechs)];
    return setTechs.filter((tech) => tech.trim() !== '');
  }

  getSummaryProfile(): ICandidateSummaryProfile {
    return {
      id: this.id,
      jobID: this.jobID,
      fullName: this.personal.fullName,
      email: this.personal.email,
      phone: this.personal.phone,
      cvLink: this.personal.cvLink,
      topSkills: this.getAllTechStacks().slice(0, 5),
      isVerify: this.isVerify,
      status: this.status,
      appliedAt: this.createdAt,
    };
  }

  getDetailProfile(): ICandidateDetailProfile {
    return {
      id: this.id,
      jobID: this.jobID,
      addedBy: this.addedBy,
      status: this.status,
      objective: this.objective,
      personal: this.personal,
      educations: this.educations,
      experiences: this.experiences,
      projects: this.projects,
      allSkills: this.getAllTechStacks(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getFulltextContent(): string {
    return this.fullTextContent;
  }

  getID(): string {
    return this.id || "";
  }
}
