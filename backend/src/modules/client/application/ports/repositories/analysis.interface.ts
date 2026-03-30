import { AnalysisEntity } from "../../../domain/entities/analysis";

export interface IAnalysisData {
  jobID: string;
  candidateID: string;
  summary?: string;
  matchingScore?: number;
  redFlags?: string[];
  suggestedQuestions?: string[];
}

export interface IAnalysisReadRepo {
  getAnalysisByCandidateId(candidateID: string): Promise<AnalysisEntity | null>;

  getAnalysisByCandidateIdAndJobId(candidateID: string, jobID: string): Promise<AnalysisEntity | null>;
}

export interface IAnalysisWriteRepo {
  createAiAnalysis(data: IAnalysisData): Promise<AnalysisEntity | null>;
}