import AiAnalysis from '../models/AiAnalysis.model';
import { AnalysisEntity, IAnalysisDetail } from '../../../domain/analysis';
import type { IAnalysisReadRepo, IAnalysisWriteRepo } from '../../../application/ports/repositories/analysis.interface';

export class AiAnalysisRepository implements IAnalysisReadRepo, IAnalysisWriteRepo {
  private mapToDetail(doc: any | null): IAnalysisDetail | null {
    if (!doc) return null;
    const d = doc as any;

    return {
      id: d._id.toString(),
      jobID: d.jobID?.toString(),
      candidateID: d.candidateID?.toString(),
      summary: d.summary,
      matchingScore: d.matchingScore,
      redFlags: d.redFlags,
      suggestedQuestions: d.suggestedQuestions,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  }

  public async create(analysis: AnalysisEntity): Promise<IAnalysisDetail | null> {
    const { id, ...data } = analysis.getDetail();
    const newAnalysis = new AiAnalysis(data);
    const savedAnalysis = await newAnalysis.save();
    return this.mapToDetail(savedAnalysis);
  }

  public async getAnalysisByCandidateId(candidateID: string): Promise<IAnalysisDetail | null> {
    const analysis = await AiAnalysis.findOne({ candidateID }).lean();
    return this.mapToDetail(analysis);
  }

  public async getAnalysisByCandidateIdAndJobId(candidateID: string, jobID: string): Promise<IAnalysisDetail | null> {
    const analysis = await AiAnalysis.findOne({
      candidateID: candidateID,
      jobID: jobID
    }).lean();
    return this.mapToDetail(analysis);
  }
}
