import "dotenv/config";
import mongoose from "mongoose";

const dbUri = process.env.MONGO_URI;

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(dbUri);
    console.log(`Db connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};
