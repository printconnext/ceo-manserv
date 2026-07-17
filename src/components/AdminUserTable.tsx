"use client";

import { useState, useMemo } from "react";

interface UserData {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    plan: string;
    createdAt: string;
    orgCount: number;
    profileCount: number;
}

interface Stats {
    total: number;
    free: number;
    pro: number;
    ultra: number;
    diamond: number;
}

const planConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    free: { label: "Free", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: "⭐" },
    pro: { label: "Pro", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: "🚀" },
    ultra: { label: "Ultra", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: "⚡" },
    diamond: { label: "Diamond", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: "💎" },
};

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffDay < 1) return "วันนี้";
    if (diffDay === 1) return "เมื่อวาน";
    if (diffDay < 30) return `${diffDay} วันที่แล้ว`;
    if (diffMonth < 12) return `${diffMonth} เดือนที่แล้ว`;
    return `${Math.floor(diffMonth / 12)} ปีที่แล้ว`;
}

export default function AdminUserTable({
    users: initialUsers,
    stats,
}: {
    users: UserData[];
    stats: Stats;
}) {
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState<string>("all");

    const filteredUsers = useMemo(() => {
        return initialUsers.filter((u) => {
            const matchSearch =
                !search ||
                (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
                (u.email || "").toLowerCase().includes(search.toLowerCase());
            const matchPlan = planFilter === "all" || u.plan === planFilter;
            return matchSearch && matchPlan;
        });
    }, [initialUsers, search, planFilter]);

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ทั้งหมด</p>
                    <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                </div>
                {(["free", "pro", "ultra", "diamond"] as const).map((plan) => {
                    const cfg = planConfig[plan];
                    return (
                        <button
                            key={plan}
                            onClick={() => setPlanFilter(planFilter === plan ? "all" : plan)}
                            className={`p-5 rounded-2xl border shadow-sm text-left transition-all ${
                                planFilter === plan
                                    ? `${cfg.bg} border-2 ring-2 ring-offset-1 ring-opacity-30 ${plan === "free" ? "ring-blue-400" : plan === "pro" ? "ring-green-400" : plan === "ultra" ? "ring-amber-400" : "ring-purple-400"}`
                                    : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                {cfg.icon} {cfg.label}
                            </p>
                            <p className={`text-3xl font-black ${cfg.color}`}>
                                {stats[plan]}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="ค้นหาตามชื่อหรืออีเมล..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {(search || planFilter !== "all") && (
                    <p className="text-sm text-gray-500 mt-2">
                        แสดง {filteredUsers.length} จาก {initialUsers.length} ผู้ใช้
                        {planFilter !== "all" && (
                            <button
                                onClick={() => setPlanFilter("all")}
                                className="ml-2 text-brand-blue hover:underline"
                            >
                                ล้างตัวกรอง plan
                            </button>
                        )}
                    </p>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">#</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ผู้ใช้</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Plan</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">สมัครเมื่อ</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Profiles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, i) => {
                                const plan = planConfig[user.plan] || planConfig.free;
                                return (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name || ""}
                                                        className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                                                        {(user.name || "?").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-semibold text-gray-900 text-sm">
                                                    {user.name || "—"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.email || "—"}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${plan.bg} ${plan.color}`}
                                            >
                                                {plan.icon} {plan.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm text-gray-700">{timeAgo(user.createdAt)}</p>
                                                <p className="text-[10px] text-gray-400">
                                                    {new Date(user.createdAt).toLocaleDateString("th-TH", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600" title="Organizations">
                                                    🏢 {user.orgCount}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-gray-600" title="Profiles">
                                                    📄 {user.profileCount}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredUsers.map((user, i) => {
                        const plan = planConfig[user.plan] || planConfig.free;
                        return (
                            <div key={user.id} className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || ""}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-blue-400 flex items-center justify-center text-white font-bold">
                                            {(user.name || "?").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{user.name || "—"}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email || "—"}</p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${plan.bg} ${plan.color}`}
                                    >
                                        {plan.icon} {plan.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{timeAgo(user.createdAt)}</span>
                                    <span>🏢 {user.orgCount} | 📄 {user.profileCount}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-gray-400 text-lg mb-1">🔍</p>
                        <p className="text-gray-500 text-sm">ไม่พบผู้ใช้ที่ตรงกับคำค้นหา</p>
                    </div>
                )}
            </div>
        </div>
    );
}
