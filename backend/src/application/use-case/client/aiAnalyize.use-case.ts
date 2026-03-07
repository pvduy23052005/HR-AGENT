import * as candidateRepository from '../../../infrastructure/database/repositories/client/candidate.repository';
import * as jobRepository from '../../../infrastructure/database/repositories/client/job.repository';
import * as aiAnalyzeRepository from '../../../infrastructure/database/repositories/client/aiAnalyize.repository';
import { analyzeCandidateWithJob } from '../../../infrastructure/external-service/gemini.service';
import type { IAiAnalyzeDetail } from '../../../domain/entities/client/aiAnalyize.entity';

export interface IAiAnalyzeResult {
  message: string;
  data: IAiAnalyzeDetail;
}

export const executeAiAnalyize = async (
  candidateID: string,
  jobID: string,
): Promise<IAiAnalyzeResult> => {
  const existingAnalysis = await aiAnalyzeRepository.getAnalysisByCandidateId(candidateID);
  if (existingAnalysis) {
    return {
      message: 'Hồ sơ ứng viên này đã được phân tích.',
      data: existingAnalysis.getDetail(),
    };
  }

  const candidate = await candidateRepository.getCandidateById(candidateID);
  if (!candidate) throw new Error('Không tìm thấy thông tin ứng viên.');

  const job = await jobRepository.getJobById(jobID);
  if (!job) throw new Error('Không tìm thấy thông tin công việc (Job).');

  const analysisResult = await analyzeCandidateWithJob(
    candidate.getDetailProfile(),
    job.getDetailJob(),
  );
  if (!analysisResult) throw new Error('Lỗi khi gọi AI phân tích dữ liệu.');

  const savedAnalysis = await aiAnalyzeRepository.createAiAnalysis({
    jobID,
    candidateID,
    summary: analysisResult['summary'] as string | undefined,
    matchingScore: analysisResult['matchingScore'] as number | undefined,
    redFlags: analysisResult['redFlags'] as string[] | undefined,
    suggestedQuestions: analysisResult['suggestedQuestions'] as string[] | undefined,
  });

  if (!savedAnalysis) throw new Error('Lỗi khi lưu kết quả phân tích.');

  return {
    message: 'Phân tích AI hoàn tất thành công.',
    data: savedAnalysis.getDetail(),
  };
};
