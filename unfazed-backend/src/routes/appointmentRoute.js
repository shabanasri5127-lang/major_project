const express = require("express");
const mongoose = require("mongoose");
const {
  createAppointment,
  listAppointments,
  updateAppointment,
} = require("../controllers/appointmentController");
const { authenticate, requireRole } = require("../middleware/auth");

const appointmentRouter = express.Router();

appointmentRouter.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: "Database is unavailable" });
  }
  return next();
});
appointmentRouter.use(authenticate);
appointmentRouter.get("/", listAppointments);
appointmentRouter.post("/", requireRole("patient"), createAppointment);
appointmentRouter.patch("/:id", updateAppointment);

module.exports = appointmentRouter;
