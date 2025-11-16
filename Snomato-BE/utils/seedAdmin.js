require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UserModel } = require("./models/user.model");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URL);

  const existing = await UserModel.findOne({ role: "Admin" });
  if (existing) {
    console.log("Admin already exists. Skipping creation.");
    return;
  }

  const hashed = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);

  const admin = new UserModel({
    username: "superadmin",
    email: process.env.DEFAULT_ADMIN_EMAIL,
    password: hashed,
    role: "Admin",
  });

  await admin.save();
  console.log("Admin created successfully:", admin.email);

  mongoose.disconnect();
}

createAdmin();
