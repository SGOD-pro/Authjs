import mongoose from "mongoose";

let isConnected = false; // Track the connection status

const ConnectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);

    isConnected = !!db.connections[0].readyState;
    console.log("Database connected!");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

export default ConnectDB;
