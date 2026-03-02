import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCloud = async (files) => {
  try {
    if (!files || files.length === 0) return [];

    const upload = files.map((file) => {
      return new Promise((resolve, reject) => {
        const originalName = file.originalname || "file_upload";

        const cleanFileName = originalName.split(".")[0].replace(/\s+/g, "_");

        const isImage = file.mimetype.startsWith("image");

        const resourceType = isImage ? "image" : "raw";

        const uploadOptions = {
          folder: "HR-AGENT",
          resource_type: resourceType,
          filename_override: cleanFileName,
          use_filename: true,
          unique_filename: false,
        };

        if (isImage) {
          uploadOptions.transformation = [
            { width: 150, height: 150, crop: "fill", gravity: "center" },
          ];
        }

        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result.secure_url);
            resolve("");
          },
        );

        stream.end(file.buffer);
      });
    });

    const fileUrls = await Promise.all(upload);
    return fileUrls;
  } catch (error) {
    console.log("Upload failed:", error);
    return [];
  }
};
