import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboardStats = asyncHandler(async (_req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [dailySales, totalOrders, totalUsers, topProducts] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, revenue: { $sum: "$total" }, orders: { $sum: 1 } } }
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Product.find().sort({ soldCount: -1 }).limit(5).select("name image soldCount price")
  ]);

  res.json({
    dailySales: dailySales[0]?.revenue ?? 0,
    dailyOrders: dailySales[0]?.orders ?? 0,
    totalOrders,
    totalUsers,
    topProducts
  });
});

