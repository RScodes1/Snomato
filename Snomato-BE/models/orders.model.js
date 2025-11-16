const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  total_price: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending"
  },

  payment_method_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
    default: null
  },

}, { timestamps: true });

const orderModel = mongoose.model("Order", OrderSchema);

module.exports = {
    orderModel
} 
