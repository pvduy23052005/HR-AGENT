import type { CandidateEntity } from '../../entities/client/candidate.entity';
import type { ICandidateData } from '../../../infrastructure/database/repositories/client/candidate.repository';
import type { VerificationEntity } from '../../entities/client/verifycation.entity';

export interface ICandidateRepository {
  createCandidate(data: ICandidateData): Promise<CandidateEntity | null>;

  getCandidateById(id: string): Promise<CandidateEntity | null>;

<<<<<<< Updated upstream
  getCandidates(): Promise<CandidateEntity[] | null>;

  createVerification(candidateID: string, data: any): Promise<VerificationEntity | null>;
=======
  getCandidates(addedBy: string): Promise<CandidateEntity[] | null>;
>>>>>>> Stashed changes
}
