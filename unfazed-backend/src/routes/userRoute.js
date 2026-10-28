const express = require("express");
const mongoose = require("mongoose");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
  listDoctors,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

const userRouter = express.Router();

userRouter.use((req, res, next) => {
  if (["/register", "/login"].includes(req.path)) return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database is unavailable. Check MongoDB Atlas Network Access and try again.",
    });
  }

  return next();
});

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", authenticate, getCurrentUser);
userRouter.patch("/me", authenticate, updateCurrentUser);
userRouter.get("/doctors", listDoctors);

module.exports = userRouter;