import type { ICandidateReadRepo, ICandidateWriteRepo } from '../../../../domain/interfaces/client/candidate.interface';
import type { IJobReadRepo } from '../../../../domain/interfaces/client/job.interface';
import type { IAnalysisReadRepo, IAnalysisWriteRepo } from '../../../../domain/interfaces/client/analysis.interface';
import type { IAIService } from '../../../../domain/interfaces/services/ai.service';
import type { IAiAnalyzeDetail } from '../../../../domain/entities/client/aiAnalyze.entity';
import { CandidateStatus } from '../../../../domain/entities/client/candidate.entity';

export interface IAiAnalyzeResult {
  message: string;
  data: IAiAnalyzeDetail;
}

export class AnalyzeUseCase {
  constructor(
    private readonly candidateRepo: ICandidateReadRepo & ICandidateWriteRepo,
    private readonly jobRepo: IJobReadRepo,
    private readonly aiAnalyzeRepo: IAnalysisReadRepo & IAnalysisWriteRepo,
    private readonly geminiService: IAIService,
  ) { }

  async execute(candidateID: string, jobID: string): Promise<IAiAnalyzeResult> {

    const existingAnalysis = await this.aiAnalyzeRepo.getAnalysisByCandidateId(candidateID);
    if (existingAnalysis) {
      return {
        message: 'Hồ sơ ứng viên này đã được phân tích.',
        data: existingAnalysis.getDetail(),
      };
    }

    const candidate = await this.candidateRepo.getCandidateById(candidateID);
    if (!candidate) throw new Error('Không tìm thấy thông tin ứng viên.');

    const job = await this.jobRepo.getJobById(jobID);
    if (!job) throw new Error('Không tìm thấy thông tin công việc (Job).');

    const analysisResult = await this.geminiService.analyzeCandidateWithJob(
      candidate.getDetailProfile(),
      job.getDetailJob(),
    );
    if (!analysisResult) throw new Error('Lỗi khi gọi AI phân tích dữ liệu.');

    const savedAnalysis = await this.aiAnalyzeRepo.createAiAnalysis({
      jobID,
      candidateID,
      summary: analysisResult['summary'] as string | undefined,
      matchingScore: analysisResult['matchingScore'] as number | undefined,
      redFlags: analysisResult['redFlags'] as string[] | undefined,
      suggestedQuestions: analysisResult['suggestedQuestions'] as string[] | undefined,
    });

    if (!savedAnalysis) throw new Error('Lỗi khi lưu kết quả phân tích.');

    await this.candidateRepo.updateStatus(candidateID, { status: CandidateStatus.SCREENING });
    return {
      message: 'Phân tích AI hoàn tất thành công.',
      data: savedAnalysis.getDetail(),
    };
  }
}
