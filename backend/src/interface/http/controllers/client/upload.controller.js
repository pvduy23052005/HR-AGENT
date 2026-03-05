import * as uploadUseCase from "../../../../application/use-case/client/upload.use-case.js";

import * as candidateRepository from "../../../../infrastructure/database/repositories/client/candidate.repository.js";

import * as uploadService from "../../../../infrastructure/external-service/upload.service.js";
import * as geminiService from "../../../../infrastructure/external-service/gemini.service.js";

export const uploadCV = async (req, res) => {
  try {
    const file = req.file;

    const { cvLink, newCandidate, dataCV } = await uploadUseCase.uploadCV(
      candidateRepository,
      uploadService,
      geminiService,
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
