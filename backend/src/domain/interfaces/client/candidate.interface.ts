import type { CandidateEntity, CandidateStatus, VerificationStatus } from '../../entities/client/candidate';

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

export interface ICandidateReadRepo {
  getCandidateById(id: string): Promise<CandidateEntity | null>;

  getCandidates(userID: string): Promise<CandidateEntity[] | null>;
}

export interface ICandidateWriteRepo {
  createCandidate(data: ICandidateData): Promise<CandidateEntity | null>;

  updateStatus(candidateID: string, status: IStatus): Promise<void>;
}