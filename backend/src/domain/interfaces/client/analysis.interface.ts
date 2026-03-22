import type { AnalysisEntity } from '../../entities/client/analysis.entity';

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
}

export interface IAnalysisWriteRepo {
  createAiAnalysis(data: IAnalysisData): Promise<AnalysisEntity | null>;
}