import dotenv from 'dotenv';
import { candidatePrompt } from '../../prompts/candiate.prompt';
import { aiAnalyzePrompt } from '../../prompts/aiAnalyize.prompt';
import { extractTextFromCV } from '../services/cvTextExtractor';
import { IGeminiService } from '../../domain/interfaces/services/gemini.service';

dotenv.config();

const LMSTUDIO_BASE_URL = process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234';
const LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL || 'lmstudio-model';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const callLmStudio = async (messages: ChatMessage[]): Promise<string> => {
  const url = `${LMSTUDIO_BASE_URL.replace(/\/$/, '')}/v1/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: LMSTUDIO_MODEL,
      messages,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LM Studio error (${response.status}): ${text}`);
  }

  const data: any = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('LM Studio trả về nội dung không hợp lệ.');
  }
  return content;
};

export class GeminiService implements IGeminiService {
  public async extractCV(fileBuffer: Buffer, mimeType: string): Promise<Record<string, any> | null> {
    try {
      const cvText = await extractTextFromCV(fileBuffer, mimeType);

      if (!cvText.trim()) {
        console.warn('Không trích xuất được nội dung văn bản từ CV.');
        return null;
      }

      const prompt = candidatePrompt.replace('{{CV_TEXT}}', cvText);

      const raw = await callLmStudio([
        { role: 'user', content: prompt },
      ]);

      return JSON.parse(raw);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Lỗi OCR và trích xuất dữ liệu CV (LM Studio):', msg);
      return null;
    }
  }

  public async analyzeCandidateWithJob(candidateData: any, jobData: any): Promise<Record<string, any> | null> {
    try {
      const combined = `${aiAnalyzePrompt}\n\nDữ liệu JSON:\n${JSON.stringify({
        candidate: candidateData,
        job: jobData,
      })}`;

      const raw = await callLmStudio([
        { role: 'user', content: combined },
      ]);

      return JSON.parse(raw);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Lỗi phân tích AI ứng viên (LM Studio):', msg);
      return null;
    }
  }
}
