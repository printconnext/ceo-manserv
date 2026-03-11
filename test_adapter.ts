import "dotenv/config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./src/lib/prisma";

const adapter = PrismaAdapter(prisma as any) as any;

async function main() {
    try {
        const user = await adapter.createUser({
            id: "test-id",
            name: "Test User",
            email: "test.adapter@example.com",
            emailVerified: null,
            image: "https://example.com/image.png"
        });
        console.log("Created User:", user);
    } catch (e) {
        console.error("Adapter Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
