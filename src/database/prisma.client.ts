import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// const prisma = new PrismaClient({ log: ["query", "warn"] });

export default prisma;
