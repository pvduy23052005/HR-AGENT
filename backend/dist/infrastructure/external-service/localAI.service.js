"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalAIService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const candiate_prompt_1 = require("../../prompts/candiate.prompt");
const aiAnalyize_prompt_1 = require("../../prompts/aiAnalyize.prompt");
dotenv_1.default.config();
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://ollama-service:11434';
const MODEL = process.env.MODEL_NAME || 'qwen2.5:3b';
const MODELS = (process.env.MODEL_LIST || MODEL)
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const generateWithRetry = async (prompt, maxRetries = 3, delayMs = 2000) => {
    for (const model of MODELS) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await axios_1.default.post(`${OLLAMA_URL}/api/generate`, {
                    model,
                    prompt,
                    stream: false,
                }, { timeout: 120_000 });
                return response.data?.response;
            }
            catch (err) {
                const status = err?.response?.status;
                if (status === 404) {
                    console.warn(`[LocalAI] Model ${model} not found. Trying next...`);
                    break;
                }
                if (status !== 429)
                    throw err;
                if (attempt < maxRetries) {
                    console.warn(`[LocalAI] Rate limited (attempt ${attempt}/${maxRetries}) - retrying in ${delayMs}ms...`);
                    await delay(delayMs);
                }
                else {
                    console.warn(`[LocalAI] Rate limited (max retries reached) for ${model}. Trying next model...`);
                }
            }
        }
    }
    throw new Error('[LocalAI] All models & retries failed.');
};
const buildCandidatePrompt = (fileBuffer, mimeType) => {
    const base64 = fileBuffer.toString('base64');
    const prompt = candiate_prompt_1.candidatePrompt.replace('{{CV_TEXT}}', `BASE64:\n${base64}\n\nMIME_TYPE: ${mimeType}`);
    return prompt;
};
const buildAnalyzePrompt = (candidateData, jobData) => {
    const payload = JSON.stringify({ candidate: candidateData, job: jobData });
    return `${aiAnalyize_prompt_1.aiAnalyzePrompt}\n\n${payload}`;
};
class LocalAIService {
    async extractCV(fileBuffer, mimeType) {
        try {
            const prompt = buildCandidatePrompt(fileBuffer, mimeType);
            const textResponse = await generateWithRetry(prompt);
            return textResponse ? JSON.parse(textResponse) : null;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Error extracting CV with local AI:', msg);
            return null;
        }
    }
    async analyzeCandidateWithJob(candidateData, jobData) {
        try {
            const prompt = buildAnalyzePrompt(candidateData, jobData);
            const textResponse = await generateWithRetry(prompt);
            return textResponse ? JSON.parse(textResponse) : null;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Error analyzing candidate with local AI:', msg);
            return null;
        }
    }
}
exports.LocalAIService = LocalAIService;
//# sourceMappingURL=localAI.service.js.map