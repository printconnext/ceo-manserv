import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAIL } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminUserTable from "@/components/AdminUserTable";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    // Guard: only admin can access
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
        redirect("/dashboard");
    }

    // Fetch all users
    const users = await prisma.user.findMany({
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

    // Get profile counts per user
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
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                plan: user.plan,
                createdAt: user.createdAt.toISOString(),
                orgCount: user._count.organizations,
                profileCount,
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

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    👥 Monitor Users
                </h1>
                <p className="text-gray-600">
                    ดูรายชื่อผู้ใช้ทั้งหมดในระบบ
                </p>
            </div>

            <AdminUserTable users={usersWithProfiles} stats={stats} />
        </div>
    );
}
