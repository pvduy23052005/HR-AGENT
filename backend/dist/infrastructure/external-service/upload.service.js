"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class UploadService {
    async uploadCloud(files) {
        try {
            if (!files || files.length === 0)
                return [];
            const upload = files.map((file) => {
                return new Promise((resolve, reject) => {
                    const originalName = file.originalname ?? 'file_upload';
                    const cleanFileName = originalName.split('.')[0].replace(/\s+/g, '_');
                    const isImage = file.mimetype.startsWith('image');
                    const resourceType = isImage ? 'image' : 'raw';
                    const uploadOptions = {
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
                    const stream = cloudinary_1.v2.uploader.upload_stream(uploadOptions, (error, result) => {
                        if (error)
                            return reject(error);
                        if (result)
                            return resolve(result.secure_url);
                        resolve('');
                    });
                    stream.end(file.buffer);
                });
            });
            return await Promise.all(upload);
        }
        catch (error) {
            console.log('Upload failed:', error);
            return [];
        }
    }
}
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map