import mongoose from "mongoose";

const connect = async () => {
  try {
    if (!process.env.MONGO) {
      throw new Error("MONGO environment variable is not set");
    }
    await mongoose.connect(process.env.MONGO);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw new Error(`Connection failed: ${error.message}`);
  }
};

export default connect;
