import type { AiAnalyzeEntity } from '../../entities/client/aiAnalyze.entity';

export interface IAnalysisData {
  jobID: string;
  candidateID: string;
  summary?: string;
  matchingScore?: number;
  redFlags?: string[];
  suggestedQuestions?: string[];
}

export interface IAnalysisReadRepo {
  getAnalysisByCandidateId(candidateID: string): Promise<AiAnalyzeEntity | null>;
}

export interface IAnalysisWriteRepo {
  createAiAnalysis(data: IAnalysisData): Promise<AiAnalyzeEntity | null>;
}