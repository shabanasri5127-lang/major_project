const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error(" MongoDB Connection Error: MONGO_URI is not configured in the backend .env file");
    return;
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
    console.error(" Retrying MongoDB connection in 10 seconds.");
    setTimeout(() => {
      void connectDB();
    }, 10000);
  }
};

module.exports = connectDB;