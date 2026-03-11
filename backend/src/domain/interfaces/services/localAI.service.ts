export interface ILocalAiService {
  extractCV(fileBuffer: Buffer, mimeType: string): Promise<Record<string, any> | null>;
  
  analyzeCandidateWithJob(candidateData: any, jobData: any): Promise<Record<string, any> | null>;
}
