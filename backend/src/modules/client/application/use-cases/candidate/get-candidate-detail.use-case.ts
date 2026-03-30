import type { ICandidateDetailProfile } from '../../../domain/entities/candidate';
import type { ICandidateReadRepo } from '../../../application/ports/repositories/candidate.interface';

export class GetCandidateDetailUseCase {
  constructor(private readonly candidateRepo: ICandidateReadRepo) { }

  async execute(candidateID: string): Promise<ICandidateDetailProfile | null> {
    const candidate = await this.candidateRepo.getCandidateById(candidateID);

    if (!candidate) {
      throw new Error("Ứng viên không tồn tại");
    }

    return candidate.getDetailProfile();
  }
}
