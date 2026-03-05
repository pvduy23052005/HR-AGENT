import * as uploadUseCase from "../../../../application/use-case/client/upload.use-case.js";

import * as candidateRepository from "../../../../infrastructure/database/repositories/client/candidate.repository.js";
import * as jobRepository from "../../../../infrastructure/database/repositories/client/job.repository.js";

import * as uploadService from "../../../../infrastructure/external-service/upload.service.js";
import * as geminiService from "../../../../infrastructure/external-service/gemini.service.js";

export const uploadCV = async (req, res) => {
  try {
    const userID = res.locals.user.id;
    const file = req.file;
    const jobID = req.body.jobID;

    const { cvLink, newCandidate, dataCV } = await uploadUseCase.uploadCV(
      candidateRepository,
      jobRepository,
      uploadService,
      geminiService,
      userID,
      jobID,
      file,
    );

    return res.status(200).json({
      message: "CV processed successfully",
      cvLink: cvLink,
      newCandidate: newCandidate,
      dataCV: dataCV,
    });
  } catch (error) {
    console.error("Error in uploadCV:", error);
    const statusCode = error.message.includes("Vui lòng tải lên") ? 400 : 500;
    return res.status(statusCode).json({ message: error.message });
  }
};
