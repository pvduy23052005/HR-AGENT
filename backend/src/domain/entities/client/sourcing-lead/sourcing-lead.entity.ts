import type { ISourcingLeadProps, ISourcingLeadSummary } from './sourcing-lead.types';
import type { SourcingSource, SourcingStatus } from './sourcing-lead.types';

export class SourcingLeadEntity {
  id: string | null;
  source: SourcingSource;
  name: string;
  profileUrl: string;
  avatarUrl: string;
  bio: string;
  location: string;
  topSkills: string[];
  jobTitle: string;
  company: string;
  email: string;
  githubRepos: number;
  githubStars: number;
  searchKeywords: string;
  jobID: string | null;
  status: SourcingStatus;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor({
    id,
    source,
    name,
    profileUrl,
    avatarUrl = '',
    bio = '',
    location = '',
    topSkills = [],
    jobTitle = '',
    company = '',
    email = '',
    githubRepos = 0,
    githubStars = 0,
    searchKeywords,
    jobID,
    status = 'new',
    createdAt,
    updatedAt,
  }: ISourcingLeadProps) {
    this.id = id ? id.toString() : null;
    this.source = source;
    this.name = name;
    this.profileUrl = profileUrl;
    this.avatarUrl = avatarUrl;
    this.bio = bio;
    this.location = location;
    this.topSkills = topSkills;
    this.jobTitle = jobTitle;
    this.company = company;
    this.email = email;
    this.githubRepos = githubRepos;
    this.githubStars = githubStars;
    this.searchKeywords = searchKeywords;
    this.jobID = jobID ? jobID.toString() : null;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getSummary(): ISourcingLeadSummary {
    return {
      id: this.id,
      source: this.source,
      name: this.name,
      profileUrl: this.profileUrl,
      avatarUrl: this.avatarUrl,
      bio: this.bio,
      location: this.location,
      topSkills: this.topSkills,
      jobTitle: this.jobTitle,
      company: this.company,
      email: this.email,
      githubRepos: this.githubRepos,
      githubStars: this.githubStars,
      searchKeywords: this.searchKeywords,
      jobID: this.jobID,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
