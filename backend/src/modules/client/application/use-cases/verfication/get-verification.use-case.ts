import { VerificationEntity } from '../../../domain/entities/verifycation';
import { IVerificationRepository } from '../../../application/ports/repositories/verification.interface';

export class GetVerificationUseCase {
  constructor(private readonly candidateRepo: IVerificationRepository) { }

  async execute(candidateID: string): Promise<VerificationEntity | null> {

    if (!candidateID) throw new Error("Thiếu candidateID!");

    const verifyCandiate = await this.candidateRepo.getVerificationByCandidateId(candidateID);


    if (!verifyCandiate) {
      throw new Error("Not found!");
    }

    return verifyCandiate;
  }
}
