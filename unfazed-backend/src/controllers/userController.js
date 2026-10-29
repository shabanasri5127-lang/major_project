const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const isDatabaseUnavailable = (error) => [
  "MongoNetworkError",
  "MongoNetworkTimeoutError",
  "MongoServerSelectionError",
  "MongooseServerSelectionError",
].includes(error.name) || (
  error.name === "MongooseError" && error.message.includes("buffering timed out")
);

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  address: user.address,
  gender: user.gender,
  dob: user.dob,
  image: user.image,
  speciality: user.speciality,
  qualification: user.qualification,
  languages: user.languages,
  hospital: user.hospital,
  bio: user.bio,
  experience: user.experience,
  fees: user.fees,
  availability: user.availability,
});

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "patient",
      speciality,
      experience,
      fees,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be patient or doctor",
      });
    }

    if (role === "doctor" && !speciality?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Speciality is required for doctor registration",
      });
    }

    const doctorFees = fees === undefined || fees === "" ? 0 : Number(fees);
    if (role === "doctor" && (!Number.isFinite(doctorFees) || doctorFees < 0)) {
      return res.status(400).json({
        success: false,
        message: "Doctor fees must be a valid non-negative number",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      speciality: role === "doctor" ? speciality.trim() : "",
      experience: role === "doctor" ? experience || "" : "",
      fees: role === "doctor" ? doctorFees : 0,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("User registration failed:", error);
    if (isDatabaseUnavailable(error)) {
      return res.status(503).json({
        success: false,
        message: "Database is unavailable. Check MongoDB Atlas Network Access and try again.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unable to register user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("User login failed:", error);
    if (isDatabaseUnavailable(error)) {
      return res.status(503).json({
        success: false,
        message: "Database is unavailable. Check MongoDB Atlas Network Access and try again.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unable to log in",
    });
  }
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.json({ success: true, user: toPublicUser(user) });
};

const updateCurrentUser = async (req, res) => {
  const allowedFields = ["name", "phone", "address", "gender", "dob", "image"];
  if (req.user.role === "doctor") {
    allowedFields.push(
      "speciality",
      "qualification",
      "languages",
      "hospital",
      "bio",
      "experience",
      "fees",
      "availability"
    );
  }

  const updates = {};
  for (const field of allowedFields) {
    if (Object.hasOwn(req.body, field)) updates[field] = req.body[field];
  }

  if (updates.fees !== undefined && (!Number.isFinite(Number(updates.fees)) || Number(updates.fees) < 0)) {
    return res.status(400).json({ success: false, message: "Fees must be a valid non-negative number" });
  }
  if (updates.availability !== undefined && (!Array.isArray(updates.availability) || updates.availability.some((day) => typeof day !== "string"))) {
    return res.status(400).json({ success: false, message: "Availability must be a list of days" });
  }
  if (updates.languages !== undefined && (!Array.isArray(updates.languages) || updates.languages.some((language) => typeof language !== "string"))) {
    return res.status(400).json({ success: false, message: "Languages must be a list of names" });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.json({ success: true, user: toPublicUser(user) });
};

const listDoctors = async (req, res) => {
  const filter = { role: "doctor" };
  if (req.query.speciality) {
    filter.speciality = new RegExp(`^${String(req.query.speciality).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  }
  const doctors = await User.find(filter)
    .select("name email image speciality experience fees address availability")
    .sort({ name: 1 });
  return res.json({ success: true, doctors });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
  listDoctors,
};