const MenuItemSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String,  // e.g., "Biryani", "Drinks", "Dessert"
    required: true
  },

  is_available: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("MenuItem", MenuItemSchema);
