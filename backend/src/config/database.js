import dns from "node:dns";
import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    // Local network DNS MongoDB SRV requests refuse kar raha tha
    if (process.env.NODE_ENV === "development") {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};