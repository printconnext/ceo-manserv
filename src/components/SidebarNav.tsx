"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
export default function SidebarNav() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const id = searchParams.get("id");
    const lang = searchParams.get("lang") || "th";

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
        </nav>
    );
}
