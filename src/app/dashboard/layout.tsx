import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthProvider from "@/components/AuthProvider";
import DashboardHeader from "@/components/DashboardHeader";
import SidebarNav from "@/components/SidebarNav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/dashboard");
    }

    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50 flex">
                {/* Sidebar Desktop */}
                <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <a href="/" className="font-bold text-xl text-gray-900">
                            CEO<span className="font-light text-brand-blue">profile</span>
                        </a>
                    </div>
                    <SidebarNav />
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Top Header with user info */}
                    <DashboardHeader />

                    {/* Page Content */}
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AuthProvider >
    );
}
