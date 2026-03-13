"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromCV = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
/**
 * Extract plain text from a CV file buffer using local libraries only.
 * Currently optimized for PDF; other mime types fall back to UTF-8 text.
 */
const extractTextFromCV = async (fileBuffer, mimeType) => {
    try {
        if (mimeType === 'application/pdf') {
            const pdfParse = pdf_parse_1.default;
            const data = await pdfParse(fileBuffer);
            return data.text || '';
        }
        // Fallback: treat as UTF-8 text (e.g. .txt) or unknown type
        return fileBuffer.toString('utf8');
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('Lỗi trích xuất văn bản từ CV:', msg);
        // Gracefully degrade to raw UTF-8 string
        return fileBuffer.toString('utf8');
    }
};
exports.extractTextFromCV = extractTextFromCV;
//# sourceMappingURL=cvTextExtractor.js.map