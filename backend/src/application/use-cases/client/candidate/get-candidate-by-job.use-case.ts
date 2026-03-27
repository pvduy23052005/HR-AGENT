import { ICandidateReadRepo } from "../../../../domain/repositories/client/candidate.interface";
import { ICanidateWithScore } from "../../../../domain/repositories/client/candidate.interface";

export class GetCanidateByJobUseCase {
  constructor(
    private readonly candidateRepo: ICandidateReadRepo
  ) { }

  async execute(jobID: string): Promise<ICanidateWithScore[]> {

    const candidates = await this.candidateRepo.getCanidateByJob(jobID);

    return candidates;
  }
}