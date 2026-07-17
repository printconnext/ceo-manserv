import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAIL } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        // Auth check: only admin can access
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Parse search params
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";

        // Fetch all users with counts
        const users = await prisma.user.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                    ],
                }
                : undefined,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                plan: true,
                createdAt: true,
                _count: {
                    select: {
                        organizations: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Get profile counts per user (through organizations)
        const usersWithProfiles = await Promise.all(
            users.map(async (user) => {
                const profileCount = await prisma.profile.count({
                    where: {
                        organization: {
                            userId: user.id,
                        },
                    },
                });
                return {
                    ...user,
                    profileCount,
                    orgCount: user._count.organizations,
                };
            })
        );

        // Stats
        const stats = {
            total: usersWithProfiles.length,
            free: usersWithProfiles.filter((u) => u.plan === "free").length,
            pro: usersWithProfiles.filter((u) => u.plan === "pro").length,
            ultra: usersWithProfiles.filter((u) => u.plan === "ultra").length,
            diamond: usersWithProfiles.filter((u) => u.plan === "diamond").length,
        };

        return NextResponse.json({ users: usersWithProfiles, stats });
    } catch (e: any) {
        console.error("[Admin API] Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
