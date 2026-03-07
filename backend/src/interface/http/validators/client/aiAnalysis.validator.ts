import { RequestHandler } from 'express';

export const validateAnalyizeCandidate: RequestHandler = (req, res, next) => {
  const { jobID, candidateID } = req.body as { jobID?: string; candidateID?: string };

  if (!jobID || !candidateID) {
    res.status(400).json({ success: false, message: 'jobId and candidateID are required.' });
    return;
  }

  next();
};
