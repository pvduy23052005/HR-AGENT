export interface IUploadFile {
  originalname?: string;
  mimetype: string;
  buffer: Buffer;
}

export interface IUploadService {
  uploadCloud(files: IUploadFile[]): Promise<(string | unknown)[]>;
}
