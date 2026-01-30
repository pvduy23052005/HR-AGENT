import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const url = process.env.MONGODB_URI || "";
    await mongoose.connect(url);

    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed:", error);
  }
};