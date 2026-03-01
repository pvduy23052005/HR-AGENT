import { GoogleGenerativeAI } from "@google/generative-ai";
import { candidatePrompt } from "../prompts/candiate.prompt.js";

export const extractCVData = async (cvText) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const prompt = candidatePrompt.replace("{{CV_TEXT}}", cvText);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown wrapping if present
    if (text.startsWith("\`\`\`json")) {
      text = text
        .replace(/^\`\`\`json/, "")
        .replace(/\`\`\`$/, "")
        .trim();
    } else if (text.startsWith("\`\`\`")) {
      text = text
        .replace(/^\`\`\`/, "")
        .replace(/\`\`\`$/, "")
        .trim();
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error extracting CV data with Gemini:", error);
    return null;
  }
};
