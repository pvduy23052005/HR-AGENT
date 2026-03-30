import { VerificationEntity } from "../../../domain/entities/verifycation";
import { IVerificationRepository } from "../../../application/ports/repositories/verification.interface";

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
