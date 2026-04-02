import { AnalysisEntity } from "../../../domain/entities/analysis";

export interface IAnalysisReadRepo {
  getAnalysisByCandidateId(candidateID: string): Promise<AnalysisEntity | null>;

  getAnalysisByCandidateIdAndJobId(candidateID: string, jobID: string): Promise<AnalysisEntity | null>;
}

export interface IAnalysisWriteRepo {
  create(analysis: AnalysisEntity): Promise<AnalysisEntity | null>;
}