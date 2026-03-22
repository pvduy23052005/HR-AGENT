import AiAnalysis from '../../models/AiAnalysis.model';
import { AnalysisEntity } from '../../../../domain/entities/client/analysis.entity';
import type { IAnalysisReadRepo, IAnalysisWriteRepo } from '../../../../domain/interfaces/client/analysis.interface';
import type { IAnalysisData } from '../../../../domain/interfaces/client/analysis.interface';

const mapToEntity = (doc: any | null): AnalysisEntity | null => {
  if (!doc) return null;
  const d = doc as any;

  return new AnalysisEntity({
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

export class AiAnalysisRepository implements IAnalysisReadRepo, IAnalysisWriteRepo {
  public async createAiAnalysis(data: IAnalysisData): Promise<AnalysisEntity | null> {
    const newAnalysis = new AiAnalysis(data);
    const savedAnalysis = await newAnalysis.save();
    return mapToEntity(savedAnalysis);
  }

  public async getAnalysisByCandidateId(candidateID: string): Promise<AnalysisEntity | null> {
    const analysis = await AiAnalysis.findOne({ candidateID }).lean();
    return mapToEntity(analysis);
  }
}
