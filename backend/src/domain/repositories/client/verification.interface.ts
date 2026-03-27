import type { VerificationEntity } from '../../entities/client/verifycation';

export interface IVerificationRepository {
  createVerification(candidateID: string, data: any): Promise<VerificationEntity | null>;

  updateIsverfiy(candidateID: string, isVerify: boolean): Promise<void>;

  getVerificationByCandidateId(candidateID: string): Promise<VerificationEntity | null>;
}
