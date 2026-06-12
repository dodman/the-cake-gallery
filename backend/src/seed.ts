import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma.js";

const images = {
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
  muffin: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=1200&q=80",
  pastry: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1200&q=80",
  breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
  lunch: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1200&q=80",
  dinner: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  drink: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80"
};

await prisma.review.deleteMany();
await prisma.userFavorite.deleteMany();
await prisma.orderItem.deleteMany();
await prisma.order.deleteMany();
await prisma.coupon.deleteMany();
await prisma.product.deleteMany();
await prisma.category.deleteMany();
await prisma.user.deleteMany();

const adminPlain = process.env.ADMIN_PASSWORD;
if (!adminPlain || adminPlain.length < 8) {
  throw new Error("Set ADMIN_PASSWORD (min 8 characters) before seeding, e.g. ADMIN_PASSWORD='your-strong-pass' npm run seed");
}
const adminPassword = await bcrypt.hash(adminPlain, 12);
const admin = await prisma.user.create({
  data: { name: "The Cake Gallery Admin", email: "waka.bk29@gmail.com", phone: "+260974063136", password: adminPassword, role: "admin", address: "Lusaka, Zambia" }
});

const _customer = await prisma.user.create({
  data: { name: "Demo Customer", email: "customer@example.com", phone: "+260961234567", password: await bcrypt.hash("Customer@123", 12), address: "Kabulonga, Lusaka" }
});

const [cakes, muffins, cookedFood, drinks] = await Promise.all([
  prisma.category.create({ data: { name: "Cakes", slug: "cakes", description: "Celebration cakes, birthday cakes and slices.", image: images.cake } }),
  prisma.category.create({ data: { name: "Muffins & Pastries", slug: "muffins-pastries", description: "Fresh muffins, croissants, buns and pastries.", image: images.muffin } }),
  prisma.category.create({ data: { name: "Cooked Food", slug: "cooked-food", description: "Breakfast, lunch, dinner, snacks and local cooked meals.", image: images.lunch } }),
  prisma.category.create({ data: { name: "Drinks", slug: "drinks", description: "Fresh juices, chilled drinks and hot beverages.", image: images.drink } })
]);

await Promise.all([
  prisma.product.create({ data: { name: "Luxury Chocolate Birthday Cake", slug: "luxury-chocolate-birthday-cake", description: "Moist chocolate sponge layered with silky buttercream and premium cocoa glaze.", categoryId: cakes.id, price: 650, image: images.cake, isFeatured: true, isTodaySpecial: true, prepTimeMinutes: 180, tags: ["birthday", "chocolate", "custom"] } }),
  prisma.product.create({ data: { name: "Vanilla Cupcake Box", slug: "vanilla-cupcake-box", description: "A dozen soft vanilla cupcakes finished with buttercream swirls.", categoryId: cakes.id, price: 180, image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=80", isFeatured: true, tags: ["cupcakes", "party"] } }),
  prisma.product.create({ data: { name: "Blueberry Muffins", slug: "blueberry-muffins", description: "Fresh baked muffins packed with blueberries and a golden crumb top.", categoryId: muffins.id, price: 35, image: images.muffin, isTodaySpecial: true, tags: ["muffin", "breakfast"] } }),
  prisma.product.create({ data: { name: "Butter Croissants", slug: "butter-croissants", description: "Flaky bakery croissants baked fresh every morning.", categoryId: muffins.id, price: 45, image: images.pastry, tags: ["pastry", "breakfast"] } }),
  prisma.product.create({ data: { name: "English Breakfast Plate", slug: "english-breakfast-plate", description: "Eggs, sausage, toast, baked beans and grilled tomato.", categoryId: cookedFood.id, price: 95, image: images.breakfast, isFeatured: true, tags: ["breakfast", "eggs"] } }),
  prisma.product.create({ data: { name: "Chicken Nshima Lunch", slug: "chicken-nshima-lunch", description: "Tender chicken stew served with nshima and seasonal vegetables.", categoryId: cookedFood.id, price: 120, image: images.lunch, isFeatured: true, tags: ["nshima", "lunch", "zambian"] } }),
  prisma.product.create({ data: { name: "Grilled Dinner Platter", slug: "grilled-dinner-platter", description: "Grilled meat, rice, chips, salad and house sauce.", categoryId: cookedFood.id, price: 165, image: images.dinner, tags: ["dinner", "grill"] } }),
  prisma.product.create({ data: { name: "Fresh Passion Juice", slug: "fresh-passion-juice", description: "Cold pressed passion fruit juice, lightly sweetened.", categoryId: drinks.id, price: 30, image: images.drink, tags: ["drink", "juice"] } })
]);

await prisma.coupon.create({
  data: { code: "WELCOME10", discountType: "percentage", value: 10, minOrderAmount: 150, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90) }
});

console.log("Seed complete", { admin: admin.email });
process.exit(0);
