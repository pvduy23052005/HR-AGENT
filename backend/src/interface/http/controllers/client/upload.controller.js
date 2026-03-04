import * as uploadService from "../../../../infrastructure/external-service/upload.service.js";
import { extractCVDataFromPDF } from "../../../../infrastructure/external-service/gemini.service.js";
import Candidate from "../../../../infrastructure/database/models/candidate.model.js";

export const uploadCV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrls = await uploadService.uploadCloud([req.file]);
    if (!fileUrls || fileUrls.length === 0)
      return res.status(500).json({ message: "Upload failed" });
    const cvLink = fileUrls[0];

    let dataCV = null;

    if (
      req.file.mimetype === "application/pdf" ||
      req.file.mimetype.startsWith("image/")
    ) {
      console.log("Đang ném file cho Gemini làm OCR...");

      dataCV = await extractCVDataFromPDF(req.file.buffer, req.file.mimetype);

      if (dataCV) {
        dataCV.personal = dataCV.personal || {};
        dataCV.personal.cvLink = cvLink;
      }
    }

    const newCandiate = new Candidate(dataCV);

    await newCandiate.save();

    return res.status(200).json({
      message: "CV processed successfully",
      cvLink: cvLink,
      dataCV: dataCV,
    });
  } catch (error) {
    console.error("Error in uploadCV:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
