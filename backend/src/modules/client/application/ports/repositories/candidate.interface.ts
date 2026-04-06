import type { CandidateEntity, CandidateStatus, VerificationStatus, IPersonal } from '../../../domain/candidate';

export interface ICandidateData {
  jobID?: string;
  addedBy?: string;
  status?: CandidateStatus;
  verificationStatus?: VerificationStatus;
  objective?: string;
  fullTextContent?: string;
  personal?: Record<string, unknown>;
  educations?: unknown[];
  experiences?: unknown[];
  projects?: unknown[];
}

export interface IStatus {
  status?: CandidateStatus;
  verificationStatus?: VerificationStatus;
}

export interface ICanidateWithScore {
  id: string;
  personal: Partial<IPersonal>;
  matchingScore: number | null;
}

export interface ICandidateReadRepo {
  getById(id: string): Promise<CandidateEntity | null>;

  getCandidates(userID: string): Promise<CandidateEntity[]>;

  checkExistsCandidate(email: string): Promise<boolean>;

  findByEmail(email: string): Promise<CandidateEntity | null>;

  countForStatistics(userId: string, startDate?: Date, endDate?: Date, status?: string): Promise<number>;

  getForStatistics(userId: string, startDate?: Date, endDate?: Date, status?: string): Promise<{ createdAt?: Date, updatedAt?: Date }[]>;

  getCanidateByJob(jobID: string): Promise<ICanidateWithScore[]>;
}

export interface ICandidateWriteRepo {
  create(candidate: CandidateEntity): Promise<CandidateEntity | null>;

  updateStatus(candidateID: string, status: IStatus): Promise<void>;

  update(candidate: CandidateEntity): Promise<CandidateEntity | null>;
}