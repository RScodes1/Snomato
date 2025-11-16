const mongoose = require("mongoose");


const OrderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true
  },

  name: { type: String, required: true },   // copy name at order time
  price: { type: Number, required: true },  // copy price at order time
  quantity: { type: Number, default: 1 },

  total: { type: Number, required: true }   // quantity × price
});


const orderItemModel = mongoose.model("orderItems", OrderItemSchema);

module.exports = {
    orderItemModel
} 
