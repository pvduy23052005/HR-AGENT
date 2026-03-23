export type SourcingSource = 'github' | 'linkedin';
export type SourcingStatus = 'new' | 'contacted' | 'rejected';

export interface ISourcingLeadProps {
  id?: string | { toString(): string } | null;
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
  jobID?: string | { toString(): string } | null;
  status?: SourcingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISourcingLeadSummary {
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
}
