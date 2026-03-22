import type { AiAnalyzeEntity } from '../../entities/client/aiAnalyze.entity';

export interface IAiAnalysisData {
  jobID: string;
  candidateID: string;
  summary?: string;
  matchingScore?: number;
  redFlags?: string[];
  suggestedQuestions?: string[];
}

export interface IAiAnalysisReadRepo {
  getAnalysisByCandidateId(candidateID: string): Promise<AiAnalyzeEntity | null>;
}

export interface IAiAnalysisWriteRepo {
  createAiAnalysis(data: IAiAnalysisData): Promise<AiAnalyzeEntity | null>;
}