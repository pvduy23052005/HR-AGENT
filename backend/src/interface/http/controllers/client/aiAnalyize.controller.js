import { executeAiAnalyize } from "../../../../application/use-case/client/aiAnalyize.use-case.js";

export const analyzeCandidate = async (req, res) => {
  try {
    const { jobID, candidateID } = req.body;

    const result = await executeAiAnalyize(candidateID, jobID);

    return res.status(200).json({
      success: true,
      aiAnalyize: result.data,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in analyzeCandidate controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Đã xảy ra lỗi hệ thống khi phân tích AI.",
    });
  }
};
