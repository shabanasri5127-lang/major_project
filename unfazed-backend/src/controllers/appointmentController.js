const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

const appointmentFields = "name email image speciality";

const createAppointment = async (req, res) => {
  const { doctorId, date, time } = req.body;
  if (
    !mongoose.isValidObjectId(doctorId) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date || "") ||
    !/^\d{2}:\d{2}$/.test(time || "")
  ) {
    return res.status(400).json({
      success: false,
      message: "A valid doctor, date, and time are required",
    });
  }
  const calendarDate = new Date(`${date}T00:00:00.000Z`);
  const appointmentAt = new Date(`${date}T${time}:00`);
  if (
    !Number.isFinite(calendarDate.getTime()) ||
    !Number.isFinite(appointmentAt.getTime()) ||
    calendarDate.toISOString().slice(0, 10) !== date ||
    Number(time.slice(0, 2)) > 23 ||
    Number(time.slice(3, 5)) > 59
  ) {
    return res.status(400).json({ success: false, message: "Appointment date or time is invalid" });
  }
  if (appointmentAt.getTime() <= Date.now()) {
    return res.status(400).json({ success: false, message: "Appointment must be in the future" });
  }

  const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
  if (!doctor) {
    return res.status(404).json({ success: false, message: "Doctor not found" });
  }
  const weekday = new Date(`${date}T00:00:00.000Z`).toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  if (!doctor.availability.includes(weekday)) {
    return res.status(409).json({
      success: false,
      message: "The doctor is not available on that day",
    });
  }

  try {
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      time,
    });
    await appointment.populate([
      { path: "patient", select: appointmentFields },
      { path: "doctor", select: appointmentFields },
    ]);
    return res.status(201).json({ success: true, appointment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "That appointment slot is already booked" });
    }
    throw error;
  }
};

const listAppointments = async (req, res) => {
  const query = req.user.role === "doctor"
    ? { doctor: req.user.id }
    : { patient: req.user.id };

  const appointments = await Appointment.find(query)
    .populate("patient", appointmentFields)
    .populate("doctor", appointmentFields)
    .sort({ date: 1, time: 1 });
  return res.json({ success: true, appointments });
};

const updateAppointment = async (req, res) => {
  const { status } = req.body;
  const permittedStatuses = req.user.role === "doctor"
    ? ["confirmed", "completed", "cancelled"]
    : ["cancelled"];
  if (!permittedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid appointment status" });
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid appointment id" });
  }

  const ownership = req.user.role === "doctor"
    ? { doctor: req.user.id }
    : { patient: req.user.id };
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, ...ownership },
    { $set: { status } },
    { new: true, runValidators: true }
  )
    .populate("patient", appointmentFields)
    .populate("doctor", appointmentFields);

  if (!appointment) {
    return res.status(404).json({ success: false, message: "Appointment not found" });
  }
  return res.json({ success: true, appointment });
};

module.exports = { createAppointment, listAppointments, updateAppointment };
