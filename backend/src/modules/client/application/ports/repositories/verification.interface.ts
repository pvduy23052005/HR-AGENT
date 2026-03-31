import type { VerificationEntity } from '../../../domain/entities/verifycation/verification.entity';

export interface IVerificationRepository {
  create(verification: VerificationEntity): Promise<VerificationEntity | null>;

  updateIsVerify(candidateId: string, isVerify: boolean): Promise<void>;

  updateVerificationStatus(candidateId: string, isVerified: boolean): Promise<void>;

  getByCandidateId(candidateId: string): Promise<VerificationEntity | null>;
}
