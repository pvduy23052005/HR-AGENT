import axios from 'axios';
import dotenv from 'dotenv';
import { candidatePrompt } from '../../../../shared/prompts/candiate.prompt';
import { aiAnalyzePrompt } from '../../../../shared/prompts/aiAnalyze.prompt';
import { ILocalAiService } from '../../application/ports/services/localAI.service';

dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://ollama-service:11434';
const MODEL = process.env.MODEL_NAME || 'qwen2.5:3b';
const MODELS = (process.env.MODEL_LIST || MODEL)
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (
  prompt: string,
  maxRetries = 3,
  delayMs = 2000,
): Promise<string | undefined> => {
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.post(
          `${OLLAMA_URL}/api/generate`,
          {
            model,
            prompt,
            stream: false,
          },
          { timeout: 120_000 },
        );
        return response.data?.response;
      } catch (err: any) {
        const status = err?.response?.status;

        if (status === 404) {
          console.warn(`[LocalAI] Model ${model} not found. Trying next...`);
          break;
        }

        if (status !== 429) throw err;

        if (attempt < maxRetries) {
          console.warn(`[LocalAI] Rate limited (attempt ${attempt}/${maxRetries}) - retrying in ${delayMs}ms...`);
          await delay(delayMs);
        } else {
          console.warn(`[LocalAI] Rate limited (max retries reached) for ${model}. Trying next model...`);
        }
      }
    }
  }

  throw new Error('[LocalAI] All models & retries failed.');
};

const buildCandidatePrompt = (fileBuffer: Buffer, mimeType: string) => {
  const base64 = fileBuffer.toString('base64');
  const prompt = candidatePrompt.replace('{{CV_TEXT}}', `BASE64:\n${base64}\n\nMIME_TYPE: ${mimeType}`);
  return prompt;
};

const buildAnalyzePrompt = (candidateData: any, jobData: any) => {
  const payload = JSON.stringify({ candidate: candidateData, job: jobData });
  return `${aiAnalyzePrompt}\n\n${payload}`;
};

export class LocalAIService implements ILocalAiService {
  public async extractCV(fileBuffer: Buffer, mimeType: string): Promise<Record<string, any> | null> {
    try {
      const prompt = buildCandidatePrompt(fileBuffer, mimeType);
      const textResponse = await generateWithRetry(prompt);
      return textResponse ? JSON.parse(textResponse) : null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error extracting CV with local AI:', msg);
      return null;
    }
  }

  public async analyzeCandidateWithJob(candidateData: any, jobData: any): Promise<Record<string, any> | null> {
    try {
      const prompt = buildAnalyzePrompt(candidateData, jobData);
      const textResponse = await generateWithRetry(prompt);
      return textResponse ? JSON.parse(textResponse) : null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error analyzing candidate with local AI:', msg);
      return null;
    }
  }
}
