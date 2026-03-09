import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

neonConfig.webSocketConstructor = typeof WebSocket !== 'undefined' ? WebSocket : null as any;
const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
