const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor"],
      default: "patient",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    dob: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },
    speciality: {
      type: String,
      default: "",
    },
    qualification: {
      type: String,
      default: "",
    },
    languages: {
      type: [String],
      default: [],
    },
    hospital: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    fees: {
      type: Number,
      default: 0,
      min: 0,
    },
    availability: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);