import type { CandidateEntity, CandidateStatus } from '../../entities/client/candidate.entity';
import type { ICandidateData } from '../../../infrastructure/database/repositories/client/candidate.repository';

export interface IStatus {
  status: CandidateStatus;
}

export interface ICandidateRepository {
  createCandidate(data: ICandidateData): Promise<CandidateEntity | null>;

  getCandidateById(id: string): Promise<CandidateEntity | null>;

  getCandidates(userID: string): Promise<CandidateEntity[] | null>;

  updateStatus(candidateID: string, status: IStatus): Promise<void>;
}