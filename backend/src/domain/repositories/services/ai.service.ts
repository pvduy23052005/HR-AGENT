export interface IAIService {
  extractCV(fileBuffer: Buffer, mimeType: string): Promise<Record<string, any> | null>;
  
  analyzeCandidateWithJob(candidateData: any, jobData: any): Promise<Record<string, any> | null>;

  generateInterviewEmail(input: Record<string, any>): Promise<{ subject: string; html: string } | null>;
}
