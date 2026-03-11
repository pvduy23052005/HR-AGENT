import pdfParseModule from 'pdf-parse';

/**
 * Extract plain text from a CV file buffer using local libraries only.
 * Currently optimized for PDF; other mime types fall back to UTF-8 text.
 */
export const extractTextFromCV = async (
  fileBuffer: Buffer,
  mimeType: string,
): Promise<string> => {
  try {
    if (mimeType === 'application/pdf') {
      const pdfParse = (pdfParseModule as unknown as (buffer: Buffer) => Promise<{ text: string }>); 
      const data = await pdfParse(fileBuffer);
      return data.text || '';
    }

    // Fallback: treat as UTF-8 text (e.g. .txt) or unknown type
    return fileBuffer.toString('utf8');
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Lỗi trích xuất văn bản từ CV:', msg);
    // Gracefully degrade to raw UTF-8 string
    return fileBuffer.toString('utf8');
  }
};

