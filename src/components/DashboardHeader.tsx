"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LOCALES } from "@/data/locales";

export default function DashboardHeader() {
    const { data: session } = useSession();
    const [lang, setLang] = useState("th");

    useEffect(() => {
        const handleLocationChange = () => {
            const params = new URLSearchParams(window.location.search);
            const l = params.get("lang") || "th";
            setLang(l);
        };

        handleLocationChange(); // Initial check
        window.addEventListener("popstate", handleLocationChange);

        // Also listen for our custom pushstate event if we use one, 
        // but pushState doesn't trigger popstate.
        // Let's also check for a small hack: setInterval or wrap history.pushState
        const interval = setInterval(handleLocationChange, 500);

        return () => {
            window.removeEventListener("popstate", handleLocationChange);
            clearInterval(interval);
        };
    }, []);

    const labels = { ...LOCALES.en.editor, ...LOCALES[lang]?.editor };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{labels.sidebarOverview || "Dashboard"}</span>
            </div>
            <div className="flex items-center gap-4">
                {session?.user?.image && (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-gray-100"
                    />
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {session?.user?.name}
                </span>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium"
                >
                    {labels.logout || "ออกจากระบบ"}
                </button>
            </div>
        </header>
    );
}
