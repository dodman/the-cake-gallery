/**
 * Rotates the admin password in the database (non-destructive — only the
 * password hash changes; no other data is touched).
 *
 * Run this LOCALLY, where your machine can reach the database:
 *
 *   NEW_ADMIN_PASSWORD='your-new-strong-password' npx tsx src/setAdminPassword.ts
 *
 * Optional: set ADMIN_EMAIL to target a specific admin account
 * (defaults to the seeded admin email).
 *
 * The new password is read from the environment, so it is never hardcoded,
 * committed, or printed to the console.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma.js";

const email = (process.env.ADMIN_EMAIL ?? "waka.bk29@gmail.com").toLowerCase().trim();
const newPassword = process.env.NEW_ADMIN_PASSWORD;

if (!newPassword || newPassword.length < 8) {
  console.error("✖  Set NEW_ADMIN_PASSWORD (minimum 8 characters). Example:");
  console.error("   NEW_ADMIN_PASSWORD='your-new-strong-password' npx tsx src/setAdminPassword.ts");
  process.exit(1);
}

const hash = await bcrypt.hash(newPassword, 12);
const result = await prisma.user.updateMany({
  where: { email, role: "admin" },
  data: { password: hash }
});

if (result.count === 0) {
  console.error(`✖  No admin account found for ${email}. Set ADMIN_EMAIL to the correct address and try again.`);
  await prisma.$disconnect();
  process.exit(1);
}

console.log(`✅  Admin password updated for ${email}. The old password no longer works.`);
await prisma.$disconnect();
process.exit(0);
