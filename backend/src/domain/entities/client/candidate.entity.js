export class CandidateEntity {
  constructor({
    id,
    jobId,
    addedBy,
    status = true,
    objective = "",
    fullTextContent = "",
    personal = {},
    educations = [],
    experiences = [],
    projects = [],
    createdAt,
    updatedAt,
  }) {
    this.id = id ? id.toString() : null;
    this.jobId = jobId ? jobId.toString() : null;
    this.addedBy = addedBy ? addedBy.toString() : null;
    this.status = status;
    this.objective = objective;
    this.fullTextContent = fullTextContent;

    this.personal = {
      fullName: personal.fullName || "",
      email: personal.email || "",
      phone: personal.phone || "",
      avatar: personal.avatar || "",
      cvLink: personal.cvLink || "",
      githubLink: personal.githubLink || "",
      socialLinks: personal.socialLinks || {},
    };

    this.educations = educations.map((edu) => ({
      school: edu.school || "",
      degree: edu.degree || "",
      major: edu.major || "",
      gpa: edu.gpa || "",
      period: edu.period || "",
    }));

    this.experiences = experiences.map((exp) => ({
      company: exp.company || "",
      position: exp.position || "",
      duration: exp.duration || "",
      description: exp.description || "",
      techStack: exp.techStack || [],
    }));

    this.projects = projects.map((proj) => ({
      title: proj.title || "",
      description: proj.description || "",
      techStack: proj.techStack || [],
      projectLink: proj.projectLink || "",
    }));

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isActive() {
    return this.status === true;
  }

  getAllTechStacks() {
    const expTechs = this.experiences.flatMap((exp) => exp.techStack || []);
    const projTechs = this.projects.flatMap((proj) => proj.techStack || []);

    const allTechs = [...expTechs, ...projTechs];
    const setTechs = [...new Set(allTechs)];

    return setTechs.filter((tech) => tech.trim() !== "");
  }

  getSummaryProfile() {
    return {
      id: this.id,
      jobId: this.jobId,
      fullName: this.personal.fullName,
      email: this.personal.email,
      phone: this.personal.phone,
      cvLink: this.personal.cvLink,
      topSkills: this.getAllTechStacks().slice(0, 5),
      status: this.status,
      appliedAt: this.createdAt,
    };
  }

  getDetailProfile() {
    return {
      id: this.id,
      jobId: this.jobId,
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
}
