"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SidebarNav() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { data: session } = useSession();
    const id = searchParams.get("id");
    const lang = searchParams.get("lang") || "th";
    const isAdmin = (session?.user as any)?.isAdmin || false;

    const labels = {
        sidebarOverview: "Overview (ภาพรวม)"
    };

    const getLink = (base: string) => {
        const params = new URLSearchParams();
        if (id) params.set("id", id);
        if (lang) params.set("lang", lang);
        const query = params.toString();
        return query ? `${base}?${query}` : base;
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="p-4 space-y-1 flex-1">
            <Link
                href={getLink("/dashboard")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive("/dashboard")
                    ? "bg-blue-50 text-brand-blue"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                {labels.sidebarOverview || "Overview"}
            </Link>

            {isAdmin && (
                <Link
                    href="/dashboard/admin"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive("/dashboard/admin")
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Monitor Users
                </Link>
            )}
        </nav>
    );
}

