import { uploadCloud } from "../../utils/upload.util.js";
import { extractCVData } from "../../utils/gemini.util.js";
import pdfParse from "pdf-parse";
import Candidate from "../../models/candidate.model.js";

export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrls = await uploadCloud([req.file]);

    if (!fileUrls || fileUrls.length === 0 || !fileUrls[0]) {
      return res.status(500).json({ message: "Upload to Cloudinary failed" });
    }

    const cvLink = fileUrls[0];
    let extractedData = null;

    if (req.file.mimetype === "application/pdf") {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        const textDataCV = pdfData.text;

        extractedData = await extractCVData(textDataCV);

        if (extractedData) {
          if (!extractedData.personal) extractedData.personal = {};
          extractedData.personal.cvLink = cvLink;
          extractedData.fullTextContent = textDataCV;
        }
      } catch (parseError) {
        console.error("Error parsing PDF:", parseError);
      }
    }

    const { jobId, addedBy } = req.body;
    let savedCandidate = null;

    if (jobId && addedBy && extractedData) {
      try {
        // Build the Candidate applying the extracted valid data
        const candidate = new Candidate({
          jobId,
          addedBy,
          objective: extractedData.objective,
          fullTextContent: extractedData.fullTextContent,
          personal: extractedData.personal,
          educations: extractedData.educations,
          experiences: extractedData.experiences,
          projects: extractedData.projects,
        });
        savedCandidate = await candidate.save();
      } catch (dbError) {
        console.error("Error saving Candidate:", dbError);
      }
    }

    return res.status(200).json({
      message: "CV processed successfully",
      cvLink: cvLink,
      extractedData: extractedData || null,
      savedCandidate: savedCandidate || null,
    });
  } catch (error) {
    console.error("Error in uploadCV:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
