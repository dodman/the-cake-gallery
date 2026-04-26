import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboardStats = asyncHandler(async (_req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dailyAgg, totalOrders, totalUsers, topProducts] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { total: true },
      _count: { id: true }
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.product.findMany({
      orderBy: { soldCount: "desc" },
      take: 5,
      select: { id: true, name: true, image: true, soldCount: true, price: true }
    })
  ]);

  res.json({
    dailySales: dailyAgg._sum.total ?? 0,
    dailyOrders: dailyAgg._count.id ?? 0,
    totalOrders,
    totalUsers,
    topProducts
  });
});
