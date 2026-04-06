import { VerificationEntity, IVerificationProps } from "../../../domain/verifycation";
import { IVerificationRepository } from "../../../application/ports/repositories/verification.interface";

export class VerifyCandidateUseCase {
  constructor(
    private readonly candidateRepo: IVerificationRepository,
  ) { }

  async execute(candidateID: string, dataVerification: any): Promise<IVerificationProps> {
    const verification = VerificationEntity.create({
      ...dataVerification,
      candidateId: candidateID,
    });

    const [result] = await Promise.all([
      this.candidateRepo.create(verification),
      this.candidateRepo.updateIsVerify(candidateID, true)
    ]);

    if (!result) throw new Error("Kiểm chứng lỗi vui lòng thử lại!");

    return result.getDetail();
  }
}
