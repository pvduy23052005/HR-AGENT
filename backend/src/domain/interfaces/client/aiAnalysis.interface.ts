import type { AiAnalyzeEntity } from '../../entities/client/aiAnalyze.entity';
import type { IAiAnalysisData } from '../../../infrastructure/database/repositories/client/aiAnalyze.repository';

export interface IAiAnalysisRepository {
  createAiAnalysis(data: IAiAnalysisData): Promise<AiAnalyzeEntity | null>;
  
  getAnalysisByCandidateId(candidateID: string): Promise<AiAnalyzeEntity | null>;
}
