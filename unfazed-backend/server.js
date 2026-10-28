const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./src/routes/userRoute");
const appointmentRouter = require("./src/routes/appointmentRoute");
const connectDB = require("./src/config/db");


dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/appointments", appointmentRouter);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.use((error, req, res, next) => {
  console.error("Request failed:", error);
  if (res.headersSent) return next(error);
  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred",
  });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});