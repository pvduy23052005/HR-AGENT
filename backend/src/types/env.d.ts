declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGODB_URI?: string;
      ACCESS_TOKEN_SECRET: string;
      EMAIL_USERNAME?: string;
      EMAIL_PASSWORD?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      CLOUDINARY_API_KEY?: string;
      CLOUDINARY_API_SECRET?: string;
      GEMINI_API_KEY?: string;
    }
  }
}

export { };
