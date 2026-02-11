import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_URI);

    console.log(`Database connected: ${connect.connection.host} | ${connect.connection.name}`);
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1); 
  }
};

export default connectDb;
