"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
const candiate_prompt_1 = require("../../prompts/candiate.prompt");
const aiAnalyize_prompt_1 = require("../../prompts/aiAnalyize.prompt");
const interviewEmail_prompt_1 = require("../../prompts/interviewEmail.prompt");
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const generateWithRetry = async (contents, maxRetries = 3, delayMs = 25000) => {
    for (const model of GEMINI_MODELS) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents,
                    config: { responseMimeType: 'application/json' },
                });
                return response.text;
            }
            catch (err) {
                const status = err?.status || err?.error?.code || (err?.message?.includes('429') ? 429 : 500);
                if (status === 404) {
                    console.warn(`[Gemini] Model ${model} không tồn tại. Đổi model...`);
                    break;
                }
                if (status !== 429)
                    throw err;
                if (attempt < maxRetries) {
                    console.warn(`[Gemini] Quá tải ${model} (Lần ${attempt}/${maxRetries}). Đợi ${delayMs / 1000}s...`);
                    await delay(delayMs);
                }
                else {
                    console.warn(`[Gemini] Cạn kiệt Quota cho ${model}. Chuyển model tiếp theo...`);
                }
            }
        }
    }
    throw new Error('[Gemini] Đã thử hết các Model và số lần Retry nhưng vẫn thất bại toàn tập.');
};
class GeminiService {
    async extractCV(fileBuffer, mimeType) {
        try {
            const contents = [
                candiate_prompt_1.candidatePrompt,
                { inlineData: { data: fileBuffer.toString('base64'), mimeType } }
            ];
            const textResponse = await generateWithRetry(contents);
            return textResponse ? JSON.parse(textResponse) : null;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Lỗi OCR và trích xuất dữ liệu CV:', msg);
            return null;
        }
    }
    async analyzeCandidateWithJob(candidateData, jobData) {
        try {
            const contents = [
                aiAnalyize_prompt_1.aiAnalyzePrompt,
                JSON.stringify({ candidate: candidateData, job: jobData })
            ];
            const textResponse = await generateWithRetry(contents);
            return textResponse ? JSON.parse(textResponse) : null;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Lỗi phân tích AI ứng viên:', msg);
            return null;
        }
    }
    async generateInterviewEmail(input) {
        try {
            const contents = [
                interviewEmail_prompt_1.interviewEmailPrompt.replace('{{INPUT_JSON}}', JSON.stringify(input)),
            ];
            const textResponse = await generateWithRetry(contents);
            if (!textResponse)
                return null;
            const parsed = JSON.parse(textResponse);
            return {
                subject: String(parsed.subject ?? '').trim(),
                html: String(parsed.html ?? ''),
            };
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Lỗi gen email mời phỏng vấn:', msg);
            return null;
        }
    }
}
exports.GeminiService = GeminiService;
//# sourceMappingURL=gemini.service.js.map