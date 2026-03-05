import { GoogleGenAI } from "@google/genai";
import { candidatePrompt } from "../../prompts/candiate.prompt.js";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (contents, maxRetries = 3, delayMs = 25000) => {
  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: contents, 
          config: {
            responseMimeType: "application/json", 
          },
        });

        return response.text;
      } catch (err) {
        const status =
          err?.status ||
          err?.error?.code ||
          (err?.message?.includes("429") ? 429 : 500);

        if (status === 404) {
          console.warn(`[Gemini] Model ${model} không tồn tại. Đổi model...`);
          break;
        }

        if (status !== 429) throw err;

        if (attempt < maxRetries) {
          console.warn(
            `[Gemini] Quá tải ${model} (Lần ${attempt}/${maxRetries}). Đợi ${delayMs / 1000}s...`,
          );
          await delay(delayMs);
        } else {
          console.warn(
            `[Gemini] Cạn kiệt Quota cho ${model}. Chuyển model tiếp theo...`,
          );
        }
      }
    }
  }
  throw new Error(
    "[Gemini] Đã thử hết các Model và số lần Retry nhưng vẫn thất bại toàn tập.",
  );
};

export const extractCV = async (fileBuffer, mimeType) => {
  try {
    const filePart = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: mimeType, 
      },
    };

    const contents = [candidatePrompt, filePart];

    const textResponse = await generateWithRetry(contents);

    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Lỗi OCR và trích xuất dữ liệu CV:", error.message);
    return null;
  }
};
