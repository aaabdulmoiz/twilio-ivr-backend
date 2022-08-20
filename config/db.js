import mongoose from "mongoose";

const dbUri =
  "mongodb+srv://moiz:Pakistan123@collaboivd.sojfe.mongodb.net/?retryWrites=true&w=majority";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(dbUri);
    console.log(`Db connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};
