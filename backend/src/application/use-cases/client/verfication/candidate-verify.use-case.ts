import { VerificationEntity } from "../../../../domain/entities/client/verifycation";
import { IVerificationRepository } from "../../../../domain/interfaces/client/verification.interface";

export class VerifyCandidateUseCase {
  constructor(
    private readonly candidateRepo: IVerificationRepository,
  ) { }

  async execute(candidateID: string, dataVerification: any): Promise<VerificationEntity | null> {

    const [result] = await Promise.all([
      this.repo.createVerification(candidateID, dataVerification),
      this.repo.updateIsverfiy(candidateID, true)
    ]);

    return result;
  }

  private get repo(): IVerificationRepository {
    return this.candidateRepo;
  }
}
