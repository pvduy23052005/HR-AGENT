import type {
  IPersonal,
  IEducation,
  IExperience,
  IProject,
  ICandidateSummaryProfile,
  ICandidateDetailProfile,
  ICandidateProps,
} from './candidate.types';
import { CandidateStatus, VerificationStatus } from './candidate.types';

export class CandidateEntity {
  id: string | null;
  jobID: string | null;
  addedBy: string | null;
  status: CandidateStatus;
  verificationStatus: VerificationStatus;
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
    status = CandidateStatus.APPLIED,
    verificationStatus = VerificationStatus.UNVERIFIED,
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
    this.verificationStatus = verificationStatus;
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
      duration: this.calculateTotalDuration(),
      status: this.status,
      appliedAt: this.createdAt,
    };
  }

  calculateTotalDuration(): string {
    let totalMonths = 0;

    for (const exp of this.experiences) {
      if (!exp.duration) continue;

      const durationStr = exp.duration.toLowerCase();

      const yearMatch = durationStr.match(/(\d+)\s*(?:năm|year|years|yr|yrs)/);
      const monthMatch = durationStr.match(/(\d+)\s*(?:tháng|month|months|mo|mos)/);

      let parsed = false;
      if (yearMatch) {
        totalMonths += parseInt(yearMatch[1], 10) * 12;
        parsed = true;
      }
      if (monthMatch) {
        totalMonths += parseInt(monthMatch[1], 10);
        parsed = true;
      }

      if (!parsed) {
        const matches = durationStr.match(/\b(19|20)\d{2}\b/g);
        if (matches && matches.length >= 2) {
          const startYear = parseInt(matches[0], 10);
          const endYear = parseInt(matches[matches.length - 1], 10);
          if (endYear >= startYear) {
            totalMonths += (endYear - startYear) * 12;
          }
        } else if (matches && matches.length === 1 && (durationStr.includes('present') || durationStr.includes('nay') || durationStr.includes('hiện tại') || durationStr.includes('now'))) {
          const startYear = parseInt(matches[0], 10);
          const currentYear = new Date().getFullYear();
          if (currentYear >= startYear) {
            totalMonths += (currentYear - startYear) * 12;
          }
        }
      }
    }

    if (totalMonths === 0) return '0 tháng';
    if (totalMonths < 12) return `${totalMonths} tháng`;

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (months === 0) return `${years} năm`;
    return `${years} năm ${months} tháng`;
  }

  getDetailProfile(): ICandidateDetailProfile {
    return {
      id: this.id,
      jobID: this.jobID,
      addedBy: this.addedBy,
      status: this.status,
      verificationStatus: this.verificationStatus,
      objective: this.objective,
      personal: this.personal,
      educations: this.educations,
      experiences: this.experiences,
      projects: this.projects,
      allSkills: this.getAllTechStacks(),
      duration: this.calculateTotalDuration(),
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
