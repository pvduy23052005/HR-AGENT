import { ICandidateReadRepo } from "../../../application/ports/repositories/candidate.interface";
import { ICanidateWithScore } from "../../../application/ports/repositories/candidate.interface";

export class GetCanidateByJobUseCase {
  constructor(
    private readonly candidateRepo: ICandidateReadRepo
  ) { }

  async execute(jobID: string): Promise<ICanidateWithScore[]> {

    const candidatesWithScore = await this.candidateRepo.getCanidateByJob(jobID);

    return candidatesWithScore;
  }
}