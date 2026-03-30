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
  private id?: string | null;
  private jobID: string | null;
  private jobTitle: string;
  private addedBy: string | null;
  private status: CandidateStatus;
  private verificationStatus: VerificationStatus;
  private objective: string;
  private isVerify?: boolean;
  private fullTextContent: string;
  private personal: IPersonal;
  private educations: IEducation[];
  private experiences: IExperience[];
  private projects: IProject[];
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

  constructor({
    id,
    jobID,
    jobTitle = '',
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
    this.jobTitle = jobTitle;
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
      jobTitle: this.jobTitle,
      fullName: this.personal.fullName,
      email: this.personal.email,
      phone: this.personal.phone,
      cvLink: this.personal.cvLink,
      topSkills: this.getAllTechStacks().slice(0, 5),
      isVerify: this.isVerify,
      duration: this.calculateTotalDuration(),
      status: this.status,
      verificationStatus: this.verificationStatus,
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

  public static create(props: ICandidateProps) {
    if (!props.personal?.email) {
      throw new Error('Domain Error: Không thể tạo ứng viên nếu thiếu Email định danh.');
    }
    if (!props.addedBy) {
      throw new Error('Domain Error: Bắt buộc phải có thông tin người thêm (addedBy).');
    }

    return new CandidateEntity({
      ...props,
      id: null,
      status: CandidateStatus.APPLIED,
      verificationStatus: VerificationStatus.UNVERIFIED,
      isVerify: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  public static restore(props: ICandidateProps): CandidateEntity {
    return new CandidateEntity(props);
  }


  public update(data: ICandidateProps, cvLink?: unknown, avatarLink?: unknown): void {
    if (data.objective) this.objective = data.objective;
    if (data.fullTextContent) this.fullTextContent = data.fullTextContent;

    if (data.personal) {
      this.personal.fullName = data.personal.fullName ?? this.personal.fullName;
      this.personal.phone = data.personal.phone ?? this.personal.phone;
      this.personal.githubLink = data.personal.githubLink ?? this.personal.githubLink;
    }

    if (cvLink) this.personal.cvLink = cvLink as string;
    if (avatarLink) this.personal.avatar = avatarLink as string;

    if (data.educations && data.educations.length > 0) {
      this.educations = data.educations.map((edu) => ({
        school: edu.school ?? '',
        degree: edu.degree ?? '',
        major: edu.major ?? '',
        gpa: edu.gpa ?? '',
        period: edu.period ?? '',
      }));
    }

    if (data.experiences && data.experiences.length > 0) {
      this.experiences = data.experiences.map((exp) => ({
        company: exp.company ?? '',
        position: exp.position ?? '',
        duration: exp.duration ?? '',
        description: exp.description ?? '',
        techStack: exp.techStack ?? [],
      }));
    }

    if (data.projects && data.projects.length > 0) {
      this.projects = data.projects.map((proj) => ({
        title: proj.title ?? '',
        description: proj.description ?? '',
        techStack: proj.techStack ?? [],
        projectLink: proj.projectLink ?? '',
      }));
    }

    this.updatedAt = new Date();
  }

  public getId(): string | null | undefined { return this.id }
  public setId(value: string | null): void { this.id = value; }

  public getJobID(): string | null { return this.jobID; }
  public setJobID(value: string | null): void { this.jobID = value; }

  public getJobTitle(): string { return this.jobTitle; }
  public setJobTitle(value: string): void { this.jobTitle = value; }

  public getAddedBy(): string | null { return this.addedBy; }
  public setAddedBy(value: string | null): void { this.addedBy = value; }

  public getStatus(): CandidateStatus { return this.status; }
  public setStatus(value: CandidateStatus): void { this.status = value; }

  public getVerificationStatus(): VerificationStatus { return this.verificationStatus; }
  public setVerificationStatus(value: VerificationStatus): void { this.verificationStatus = value; }

  public getObjective(): string { return this.objective; }
  public setObjective(value: string): void { this.objective = value; }

  public getIsVerify(): boolean | undefined { return this.isVerify; }
  public setIsVerify(value: boolean | undefined): void { this.isVerify = value; }

  public getFullTextContent(): string { return this.fullTextContent; }
  public setFullTextContent(value: string): void { this.fullTextContent = value; }

  public getPersonal(): IPersonal { return this.personal; }
  public setPersonal(value: IPersonal): void { this.personal = value; }

  public getEducations(): IEducation[] { return this.educations; }
  public setEducations(value: IEducation[]): void { this.educations = value; }

  public getExperiences(): IExperience[] { return this.experiences; }
  public setExperiences(value: IExperience[]): void { this.experiences = value; }

  public getProjects(): IProject[] { return this.projects; }
  public setProjects(value: IProject[]): void { this.projects = value; }

  public getCreatedAt(): Date | undefined { return this.createdAt; }
  public setCreatedAt(value: Date | undefined): void { this.createdAt = value; }

  public getUpdatedAt(): Date | undefined { return this.updatedAt; }
  public setUpdatedAt(value: Date | undefined): void { this.updatedAt = value; }
}

