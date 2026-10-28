require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../src/models/User");

const demoAccounts = [
  {
    name: "Dr. Ananya Mehta",
    email: "doctor1@example.com",
    password: "Doctor@123",
    role: "doctor",
    speciality: "Cardiology",
    qualification: "MBBS, MD",
    experience: "12 years",
    fees: 1200,
    availability: ["Monday", "Tuesday", "Thursday", "Friday"],
  },
  {
    name: "Dr. Rahul Nair",
    email: "doctor2@example.com",
    password: "Doctor@123",
    role: "doctor",
    speciality: "Orthopaedics",
    qualification: "MBBS, MS (Orthopaedics)",
    experience: "10 years",
    fees: 1000,
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
  },
  {
    name: "Jordan Lee",
    email: "patient1@example.com",
    password: "Patient@123",
    role: "patient",
  },
  {
    name: "Sam Taylor",
    email: "patient2@example.com",
    password: "Patient@123",
    role: "patient",
  },
];

const seedDemoAccounts = async () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Demo accounts cannot be seeded when NODE_ENV is production.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured in the backend .env file.");
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });

  for (const { password, ...account } of demoAccounts) {
    const existingAccount = await User.findOne({ email: account.email }).select("_id");
    if (existingAccount) {
      console.log(`Skipped existing account: ${account.email}`);
      continue;
    }

    await User.create({
      ...account,
      password: await bcrypt.hash(password, 10),
    });
    console.log(`Created demo account: ${account.email}`);
  }
};

seedDemoAccounts()
  .catch((error) => {
    console.error("Unable to seed demo accounts:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
