import type { AiAnalyizeEntity } from '../../entities/client/aiAnalyize.entity';
import type { IAiAnalysisData } from '../../../infrastructure/database/repositories/client/aiAnalyize.repository';

export interface IAiAnalysisRepository {
  createAiAnalysis(data: IAiAnalysisData): Promise<AiAnalyizeEntity | null>;
  
  getAnalysisByCandidateId(candidateID: string): Promise<AiAnalyizeEntity | null>;
}
