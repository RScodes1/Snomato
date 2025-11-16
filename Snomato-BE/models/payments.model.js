const mongoose = require('mongoose');


const PaymentMethodSchema = new mongoose.Schema({
  type: { type: String, required: true },        // "card", "upi", etc
  display_name: { type: String, required: true }, // "Visa Card", "Google Pay"
  details: { type: Object },                      // JSON (masked card, UPI ID)
  is_active: { type: Boolean, default: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const PaymentMethodModel = mongoose.model('paymentMethod',PaymentMethodSchema)

module.exports ={
    PaymentMethodModel
}