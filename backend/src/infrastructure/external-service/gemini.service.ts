import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { candidatePrompt } from '../../prompts/candiate.prompt';
import { aiAnalyzePrompt } from '../../prompts/aiAnalyze.prompt';
import { interviewEmailPrompt } from '../../prompts/interviewEmail.prompt';
import { IGeminiService } from '../../domain/interfaces/services/ai.service';


dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (contents: any, maxRetries = 3, delayMs = 25000): Promise<string | undefined> => {
  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: { responseMimeType: 'application/json' },
        });
        return response.text;
      } catch (err: any) {
        const status = err?.status || err?.error?.code || (err?.message?.includes('429') ? 429 : 500);

        if (status === 404) {
          console.warn(`[Gemini] Model ${model} không tồn tại. Đổi model...`);
          break;
        }

        if (status !== 429) throw err;

        if (attempt < maxRetries) {
          console.warn(`[Gemini] Quá tải ${model} (Lần ${attempt}/${maxRetries}). Đợi ${delayMs / 1000}s...`);
          await delay(delayMs);
        } else {
          console.warn(`[Gemini] Cạn kiệt Quota cho ${model}. Chuyển model tiếp theo...`);
        }
      }
    }
  }
  throw new Error('[Gemini] Đã thử hết các Model và số lần Retry nhưng vẫn thất bại toàn tập.');
};

export class GeminiService implements IGeminiService {
  public async extractCV(fileBuffer: any, mimeType: string): Promise<Record<string, any> | null> {
    try {
      const contents = [
        candidatePrompt,
        { inlineData: { data: fileBuffer.toString('base64'), mimeType } }
      ];

      const textResponse = await generateWithRetry(contents);
      return textResponse ? JSON.parse(textResponse) : null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Lỗi OCR và trích xuất dữ liệu CV:', msg);
      return null;
    }
  }

  public async analyzeCandidateWithJob(candidateData: any, jobData: any): Promise<Record<string, any> | null> {
    try {
      const contents = [
        aiAnalyzePrompt,
        JSON.stringify({ candidate: candidateData, job: jobData })
      ];

      const textResponse = await generateWithRetry(contents);
      return textResponse ? JSON.parse(textResponse) : null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Lỗi phân tích AI ứng viên:', msg);
      return null;
    }
  }

  public async generateInterviewEmail(
    input: Record<string, any>,
  ): Promise<{ subject: string; html: string } | null> {
    try {
      const contents = [
        interviewEmailPrompt.replace('{{INPUT_JSON}}', JSON.stringify(input)),
      ];

      const textResponse = await generateWithRetry(contents);
      if (!textResponse) return null;
      const parsed = JSON.parse(textResponse) as { subject?: string; html?: string };

      return {
        subject: String(parsed.subject ?? '').trim(),
        html: String(parsed.html ?? ''),
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Lỗi gen email mời phỏng vấn:', msg);
      return null;
    }
  }
}