import type { VerificationEntity } from '../../../domain/entities/verifycation/verifycation.entity';

export interface IVerificationRepository {
  createVerification(candidateID: string, data: any): Promise<VerificationEntity | null>;

  updateIsverfiy(candidateID: string, isVerify: boolean): Promise<void>;

  updateVerificationStatus(candidateID: string, isVerified: boolean): Promise<void>;

  getVerificationByCandidateId(candidateID: string): Promise<VerificationEntity | null>;
}
