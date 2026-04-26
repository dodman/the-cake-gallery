import { prisma } from "../lib/prisma.js";

export async function connectDb() {
  await prisma.$connect();
  console.log("Database connected");
}
