import { VerificationEntity } from '../../../../domain/entities/client/verifycation';
import { IVerificationRepository } from '../../../../domain/repositories/client/verification.interface';

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
