import type { ICandidateReadRepo, ICandidateWriteRepo, IStatus } from "../../../../domain/interfaces/client/candidate.interface";

export class UpdateStatusUseCase {

  constructor(
    private readonly candidateRepo: ICandidateReadRepo & ICandidateWriteRepo
  ) { }

  async execute(candidateID: string, status: IStatus): Promise<void> {

    const candidate = await this.candidateRepo.getCandidateById(candidateID);

    if (!candidate) {
      throw new Error("Ứng viên không tồn tại");
    }

    await this.candidateRepo.updateStatus(candidateID, status);
  }
}