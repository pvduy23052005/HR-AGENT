import { AnalysisEntity, IAnalysisDetail } from "../../../domain/analysis";

export interface IAnalysisReadRepo {
  getAnalysisByCandidateId(candidateID: string): Promise<IAnalysisDetail | null>;

  getAnalysisByCandidateIdAndJobId(candidateID: string, jobID: string): Promise<IAnalysisDetail | null>;
}

export interface IAnalysisWriteRepo {
  create(analysis: AnalysisEntity): Promise<IAnalysisDetail | null>;
}