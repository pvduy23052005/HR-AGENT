import { VerificationEntity } from '../../../../domain/entities/client/verifycation.entity';
import { IVerificationRepository } from '../../../../domain/interfaces/client/verification.interface';

export class GetVerificationUseCase {
  constructor(private readonly candidateRepo: IVerificationRepository) {}

  async execute(candidateID: string): Promise<VerificationEntity | null> {
    return this.candidateRepo.getVerificationByCandidateId(candidateID);
  }
}
