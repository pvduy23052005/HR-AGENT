import type { ICandidateSummaryProfile } from '../../../domain/candidate';
import type { ICandidateReadRepo } from '../../../application/ports/repositories/candidate.interface';

export class GetCandidatesUseCase {
  constructor(private readonly candidateRepo: ICandidateReadRepo) { }

  async execute(userID: string): Promise<ICandidateSummaryProfile[]> {

    const candidates = await this.candidateRepo.getCandidates(userID);

    return candidates.map(c => c.getSummaryProfile());
  }
}