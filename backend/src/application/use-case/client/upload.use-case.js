export const uploadCV = async (
  candidateRepository,
  uploadService,
  geminiService,
  file,
) => {
  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const fileUrls = await uploadService.uploadCloud([file]);

  if (!fileUrls || fileUrls.length === 0) {
    return res.status(500).json({ message: "Upload failed" });
  }

  const cvLink = fileUrls[0];

  let dataCV = null;

  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    console.log("Đang ném file cho Gemini làm OCR...");

    dataCV = await geminiService.extractCV(file.buffer, file.mimetype);

    if (dataCV) {
      dataCV.personal = dataCV.personal || {};
      dataCV.personal.cvLink = cvLink;
    }
  }

  const newCandidate = await candidateRepository.createCandidate(dataCV);

   return {
    cvLink,
    newCandidate,
    dataCV,
  };
};
