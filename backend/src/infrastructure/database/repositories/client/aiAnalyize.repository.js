import AiAnalysis from "../../models/AiAnalysis.model.js";
import { AiAnalyizeEntity } from "../../../../domain/entities/client/aiAnalyize.entity.js";

const mapToEntity = (doc) => {
  if (!doc) return null;

  return new AiAnalyizeEntity({
    id: doc._id,
    jobID: doc.jobID,
    candidateID: doc.candidateID,
    summary: doc.summary,
    matchingScore: doc.matchingScore,
    redFlags: doc.redFlags,
    suggestedQuestions: doc.suggestedQuestions,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
};

export const createAiAnalysis = async (data) => {
  const sanitizedInput = new AiAnalyizeEntity(data);
  const { id, ...dataToSave } = sanitizedInput;

  const newAnalysis = new AiAnalysis(dataToSave);
  const savedAnalysis = await newAnalysis.save();

  return mapToEntity(savedAnalysis);
};

export const getAnalysisByCandidateId = async (candidateID) => {
  const analysis = await AiAnalysis.findOne({ candidateID }).lean();
  return mapToEntity(analysis);
};
