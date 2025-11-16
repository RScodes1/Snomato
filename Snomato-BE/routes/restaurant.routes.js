const express = require('express');
const { restaurantModel } = require('../models/restaurants.model');

const restaurantRouter = express.Router();
 
restaurantRouter.get("/restaurants", async (req, res) => {
  const restaurants = await restaurantModel.find();
  res.json({ success: true, data: restaurants });
});

restaurantRouter.get("/restaurants/:id/menu", async (req, res) => {
  const restaurant = await restaurantModel.findById(req.params.id);

  if (!restaurant)
    return res.status(404).json({ success: false, message: "Restaurant not found" });

  res.json({ success: true, data: restaurant.menu });
});

restaurantRouter.post("/order", async (req, res) => {
  const { userId, restaurantId, items } = req.body;

  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant)
    return res.status(404).json({ success: false, message: "Restaurant not found" });

  // calculate total
  let total = 0;
  const formattedItems = items.map(i => {
    const menuItem = restaurant.menu.id(i.menuItemId);
    if (!menuItem) throw new Error("Menu item not found");

    const lineTotal = menuItem.price * i.quantity;
    total += lineTotal;

    return {
      menuItemId: i.menuItemId,
      name: menuItem.name,
      price: menuItem.price,
      quantity: i.quantity
    };
  });

  const newOrder = await Order.create({
    userId,
    restaurantId,
    items: formattedItems,
    totalAmount: total
  });

  res.json({ success: true, data: newOrder });
});

restaurantRouter.post(
  "/orders/:id/checkout",
  auth,
  allowRoles("admin", "manager"),
  async (req, res) => {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending")
      return res.status(400).json({ message: "Order cannot be paid twice" });

    order.status = "paid";
    await order.save();

    res.json({ success: true, message: "Order paid successfully" });
  }
);


router.post(
  "/orders/:id/cancel",
  auth,
  allowRoles("admin", "manager"),
  async (req, res) => {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "cancelled")
      return res.status(400).json({ message: "Order already cancelled" });

    order.status = "cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled" });
  }
);



module.exports = {
    restaurantRouter
}