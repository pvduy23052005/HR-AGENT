import { VerificationEntity } from "../../../../domain/entities/client/verifycation.entity";
import { ICandidateRepository } from "../../../../domain/interfaces/client/candidate.interface";

export class CandidateVeriFyUseCase {
  constructor(
    private readonly candidateRepo: ICandidateRepository
  ) {}

  async execute(candidateID: string, dataVerification: any): Promise<VerificationEntity | null> {
    const result = await this.candidateRepo.createVerification(candidateID, dataVerification);
    return result;
  }
}