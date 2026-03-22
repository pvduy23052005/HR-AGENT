import AiAnalysis from '../../models/AiAnalysis.model';
import { AiAnalyzeEntity } from '../../../../domain/entities/client/aiAnalyze.entity';
import type { IAiAnalysisReadRepo, IAiAnalysisWriteRepo } from '../../../../domain/interfaces/client/analysis.interface';
import type { IAiAnalysisData } from '../../../../domain/interfaces/client/analysis.interface';

const mapToEntity = (doc: any | null): AiAnalyzeEntity | null => {
  if (!doc) return null;
  const d = doc as any;

  return new AiAnalyzeEntity({
    id: d._id.toString(),
    jobID: d.jobID?.toString(),
    candidateID: d.candidateID?.toString(),
    summary: d.summary,
    matchingScore: d.matchingScore,
    redFlags: d.redFlags,
    suggestedQuestions: d.suggestedQuestions,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  });
};


export class AiAnalysisRepository implements IAiAnalysisReadRepo, IAiAnalysisWriteRepo {
  public async createAiAnalysis(data: IAiAnalysisData): Promise<AiAnalyzeEntity | null> {
    const newAnalysis = new AiAnalysis(data);
    const savedAnalysis = await newAnalysis.save();
    return mapToEntity(savedAnalysis);
  }

  public async getAnalysisByCandidateId(candidateID: string): Promise<AiAnalyzeEntity | null> {
    const analysis = await AiAnalysis.findOne({ candidateID }).lean();
    return mapToEntity(analysis);
  }
}
