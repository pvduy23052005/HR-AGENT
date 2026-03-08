import type { CandidateEntity } from '../../entities/client/candidate.entity';
import type { ICandidateData } from '../../../infrastructure/database/repositories/client/candidate.repository';

export interface ICandidateRepository {
  createCandidate(data: ICandidateData): Promise<CandidateEntity | null>;
  getCandidateById(id: string): Promise<CandidateEntity | null>;
}
