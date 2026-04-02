import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { IUploadService, IUploadFile } from '../../application/ports/services/upload.service';

export class UploadService implements IUploadService {
  public async uploadCloud(files: IUploadFile[]): Promise<(string | unknown)[]> {
    try {
      if (!files || files.length === 0) return [];

      const upload = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const originalName = file.originalname ?? 'file_upload';
          const cleanFileName = originalName.split('.')[0].replace(/\s+/g, '_');
          const isImage = file.mimetype.startsWith('image');
          const resourceType = isImage ? 'image' : 'raw';

          const uploadOptions: Record<string, unknown> = {
            folder: 'HR-AGENT',
            resource_type: resourceType,
            filename_override: cleanFileName,
            use_filename: true,
            unique_filename: false,
          };

          if (isImage) {
            uploadOptions['transformation'] = [
              { width: 150, height: 150, crop: 'fill', gravity: 'center' },
            ];
          }

          const stream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) return reject(error);
              if (result) return resolve(result.secure_url);
              resolve('');
            },
          );

          stream.end(file.buffer);
        });
      });

      return await Promise.all(upload);
    } catch (error) {
      console.log('Upload failed:', error);
      return [];
    }
  }
}
