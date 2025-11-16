const mongoose = require('mongoose');

const PendingUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  status:   { type: String, default: "pending" },
  requestedAt: { type: Date, default: Date.now }
});

const PendingUserModel = mongoose.model("PendingUser", PendingUserSchema);

module.exports = {
    PendingUserModel
} 