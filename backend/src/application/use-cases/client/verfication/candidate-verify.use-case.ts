import { VerificationEntity } from "../../../../domain/entities/client/verifycation";
import { IVerificationRepository } from "../../../../domain/repositories/client/verification.interface";

export class VerifyCandidateUseCase {
  constructor(
    private readonly candidateRepo: IVerificationRepository,
  ) { }

  async execute(candidateID: string, dataVerification: any): Promise<VerificationEntity | null> {

    const [result] = await Promise.all([
      this.candidateRepo.createVerification(candidateID, dataVerification),
      this.candidateRepo.updateIsverfiy(candidateID, true)
    ]);

    if (!result) throw new Error("Kiểm chức lỗi vui lòng thử lại!");

    return result;
  }
}
