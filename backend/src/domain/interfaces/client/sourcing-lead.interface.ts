import type { SourcingLeadEntity, SourcingSource, SourcingStatus } from '../../entities/client/sourcing-lead.entity';

export interface ISourcingLeadData {
  source: SourcingSource;
  name: string;
  profileUrl: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  topSkills?: string[];
  jobTitle?: string;
  company?: string;
  email?: string;
  githubRepos?: number;
  githubStars?: number;
  searchKeywords: string;
  jobID?: string;
  status?: SourcingStatus;
}

export interface ISourcingLeadRepository {
  create(data: ISourcingLeadData): Promise<SourcingLeadEntity | null>;

  findAll(filters?: { jobID?: string; source?: SourcingSource }): Promise<SourcingLeadEntity[]>;

  findById(id: string): Promise<SourcingLeadEntity | null>;

  updateStatus(id: string, status: SourcingStatus): Promise<SourcingLeadEntity | null>;

  deleteById(id: string): Promise<boolean>;

  existsByProfileUrl(profileUrl: string): Promise<boolean>;
}
