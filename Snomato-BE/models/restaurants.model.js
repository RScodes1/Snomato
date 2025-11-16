const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
}, { timestamps: true });

const restaurantModel = mongoose.model("Restaurant", restaurantSchema);

module.exports = {
    restaurantModel
} 
