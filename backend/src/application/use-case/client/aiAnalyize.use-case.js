import { getCandidateById } from "../../../infrastructure/database/repositories/client/candidate.repository.js";
import { getJobById } from "../../../infrastructure/database/repositories/client/job.repository.js";
import { analyzeCandidateWithJob } from "../../../infrastructure/external-service/gemini.service.js";
import {
  createAiAnalysis,
  getAnalysisByCandidateId,
} from "../../../infrastructure/database/repositories/client/aiAnalyize.repository.js";

export const executeAiAnalyize = async (candidateID, jobID) => {
  const existingAnalysis = await getAnalysisByCandidateId(candidateID);
  if (existingAnalysis) {
    return {
      message: "Hồ sơ ứng viên này đã được phân tích.",
      data: existingAnalysis.getDetail(),
    };
  }

  const candidate = await getCandidateById(candidateID);
  if (!candidate) {
    throw new Error("Không tìm thấy thông tin ứng viên.");
  }

  const job = await getJobById(jobID);
  if (!job) {
    throw new Error("Không tìm thấy thông tin công việc (Job).");
  }

  const candidateDetail = candidate.getDetail();
  const jobDetail = job.getDetailJob();

  const analysisResult = await analyzeCandidateWithJob(
    candidateDetail,
    jobDetail,
  );

  if (!analysisResult) {
    throw new Error("Lỗi khi gọi AI phân tích dữ liệu.");
  }

  // saveDb .
  const savedAnalysis = await createAiAnalysis({
    jobID: jobID,
    candidateID: candidateID,
    summary: analysisResult.summary,
    matchingScore: analysisResult.matchingScore,
    redFlags: analysisResult.redFlags,
    suggestedQuestions: analysisResult.suggestedQuestions,
  });

  return {
    message: "Phân tích AI hoàn tất thành công.",
    data: savedAnalysis.getDetail(),
  };
};
