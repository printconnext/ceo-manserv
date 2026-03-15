import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteProfileButton from "@/components/DeleteProfileButton";
import DuplicateProfileButton from "@/components/DuplicateProfileButton";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const plan = (user as any)?.plan || "free";

    // Plan Display Config
    const planConfig: Record<string, { label: string, color: string, badgeIcon: string, canMultiProfile: boolean, canMultiOrg: boolean }> = {
        free: { label: "Free Account", color: "text-blue-700 bg-blue-50 border-blue-100", badgeIcon: "⭐", canMultiProfile: false, canMultiOrg: false },
        pro: { label: "Pro Member", color: "text-green-700 bg-green-50 border-green-100", badgeIcon: "🚀", canMultiProfile: true, canMultiOrg: false },
        ultra: { label: "Ultra Member", color: "text-amber-700 bg-amber-50 border-amber-100", badgeIcon: "⚡", canMultiProfile: true, canMultiOrg: true },
        diamond: { label: "Diamond Member", color: "text-purple-700 bg-purple-50 border-purple-200", badgeIcon: "💎", canMultiProfile: true, canMultiOrg: true },
    };

    const currentPlan = planConfig[plan] || planConfig.free;

    let organizations: any[] = [];
    if (user?.id) {
        organizations = await prisma.organization.findMany({
            where: { userId: user.id },
            include: {
                profiles: {
                    include: { translations: { select: { lang: true } } },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
    }

    const totalProfiles = organizations.reduce((acc, org) => acc + (org.profiles?.length || 0), 0);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name || "CEO"}</h1>
                    <p className="text-gray-600">จัดการข้อมูลผู้บริหารและนามบัตรดิจิทัลของคุณ</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2 ${currentPlan.color}`}>
                    {currentPlan.badgeIcon} {currentPlan.label}
                    {plan === "free" && (
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tighter">1 Page Limit</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profiles List / Main Action */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">โปรไฟล์ของคุณ</h2>
                        <div className="flex gap-2">
                            {currentPlan.canMultiOrg && (
                                <Link href="/dashboard/profile/new?newOrg=true" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">
                                    + องค์กรใหม่
                                </Link>
                            )}
                            {(currentPlan.canMultiProfile || totalProfiles === 0) && (
                                <Link href="/dashboard/profile/new" className="px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors">
                                    + สร้างหน้าใหม่
                                </Link>
                            )}
                        </div>
                    </div>

                    {organizations.filter(org => (org.profiles?.length || 0) > 0).length > 0 ? (
                        <div className="space-y-8">
                            {organizations.filter(org => (org.profiles?.length || 0) > 0).map((org) => {
                                // Logic to cleanup name display
                                let displayName = org.name;
                                if (org.slug === 'convey-care' && displayName.includes('แมน')) {
                                    displayName = 'Convey Care';
                                }

                                return (
                                    <div key={org.id} className="space-y-4">
                                        <div className="flex items-center gap-3 pt-4 first:pt-0">
                                            <div className="w-1.5 h-6 bg-brand-blue rounded-full"></div>
                                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">{displayName}</h2>
                                            <div className="h-px flex-grow bg-gray-100"></div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {org.profiles?.map((p: any) => {
                                                // Each profile record now represents exactly ONE language
                                                const pageLang = p.translations?.[0]?.lang?.toUpperCase() || "TH";

                                                return (
                                                    <div key={p.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-200 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-blue font-bold text-lg">
                                                                {p.fullName?.charAt(0) || "P"}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-bold text-gray-900">{p.fullName}</h3>
                                                                    <span className="px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-[8px] font-black uppercase tracking-tighter flex items-center gap-0.5">
                                                                        {pageLang}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-500">/{org.slug}/{p.slug.replace(/-(th|en|ch|jp|lo|hi|fr|it|es|de|ru|fa|pt|br|vi|my|ph|id)$/i, "")}/{p.translations?.[0]?.lang || 'th'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={`/dashboard/profile?id=${p.id}`}
                                                                className="p-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                                                                title="ตั้งค่าโปรไฟล์ (ชื่อ/URL/องค์กร)"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                                            </Link>
                                                            <Link
                                                                href={`/dashboard/vcard?id=${p.id}`}
                                                                className="p-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                                                                title="ดู QR Code นามบัตร"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                                                            </Link>
                                                            <div className="w-px h-6 bg-gray-100 mx-1"></div>
                                                            <DeleteProfileButton profileId={p.id} profileName={p.fullName} />
                                                            <DuplicateProfileButton profileId={p.id} profileName={p.fullName} />
                                                            <Link href={`/dashboard/settings?id=${p.id}&lang=${p.translations?.[0]?.lang || 'th'}`} className="px-3 py-2 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors">
                                                                แก้ไขเนื้อหา
                                                            </Link>
                                                             <a href={`/${org.slug.toLowerCase()}/${p.slug.toLowerCase().replace(/-(th|en|ch|jp|lo|hi|fr|it|es|de|ru|fa|pt|br|vi|my|ph|id)$/i, "")}/${(p.translations?.[0]?.lang || 'th').toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">
                                                                 เปิดเว็บ
                                                             </a>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">📄</div>
                            <h3 className="font-bold text-gray-900 mb-2">ยังไม่มีประวัติโปรไฟล์</h3>
                            <p className="text-sm text-gray-500 mb-6">เริ่มต้นสร้างหน้าโปรไฟล์ผู้บริหารของคุณได้ที่นี่</p>
                            <Link href="/dashboard/profile" className="inline-flex px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-800 transition-all">
                                สร้างโปรไฟล์แรกของคุณ
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar Section */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">สถิติโดยรวม</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">ยอดการเข้าชมทั้งหมด</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">จำนวนหน้าที่เปิดใช้งาน</p>
                                <p className="text-2xl font-bold text-gray-900">{totalProfiles}</p>
                            </div>
                        </div>
                    </div>

                    {/* VCard Link */}
                    <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-100 group transition-all">
                        <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                            นามบัตรดิจิทัล (VCard)
                        </h3>
                        <p className="text-white/80 text-xs">QR Code จะถูกสร้างแยกตามแต่ละโปรไฟล์เมื่อคุณกดเข้าไปแก้ไข</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
