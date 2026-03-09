"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import UnifiedEditor from "@/components/UnifiedEditor";
import { LOCALES } from "@/data/locales";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [lang, setLang] = useState("th");

    // Initialize lang from URL if present
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const l = params.get("lang");
            if (l && LOCALES[l]) {
                setLang(l);
            }
        }
    }, []);

    const labels = { ...LOCALES.en.editor, ...LOCALES[lang]?.editor };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{labels.pageTitle || "Profile Editor (เครื่องมือแก้ไขโปรไฟล์)"}</h1>
                <p className="text-gray-600">{labels.pageDescription || "จัดการข้อมูล รูปภาพ และความสวยงามของโปรไฟล์คุณแบบแบ่งตามส่วน"}</p>
            </div>

            {/* Unified Editor Component */}
            <UnifiedEditor lang={lang} onLangChange={setLang} />


            {/* Account Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-bold text-gray-900">{labels.accountData || "ข้อมูลบัญชี"}</h3>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        {session?.user?.image && (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                width={64}
                                height={64}
                                className="rounded-full ring-4 ring-gray-100"
                            />
                        )}
                        <div>
                            <p className="text-lg font-bold text-gray-900">{session?.user?.name}</p>
                            <p className="text-sm text-gray-500">{session?.user?.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <span className="text-gray-500 block mb-1">{labels.loginProviders || "ผู้ให้บริการล็อกอิน"}</span>
                            <span className="font-medium text-gray-900">Google</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <span className="text-gray-500 block mb-1">{labels.package || "แพ็กเกจ"}</span>
                            <span className="font-medium text-gray-900">{session?.user?.plan === 'free' ? 'Free' : (session?.user?.plan || 'Diamond')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Visibility */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-bold text-gray-900">{labels.privacy || "ความเป็นส่วนตัว"}</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{labels.showPublicProfile || "แสดงโปรไฟล์สาธารณะ"}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{labels.allowPublicVisit || "อนุญาตให้ผู้อื่นเข้าชมโปรไฟล์ของคุณผ่าน URL สาธารณะ"}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{labels.showEmail || "แสดงอีเมลในโปรไฟล์"}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{labels.emailVisitors || "ผู้เข้าชมจะเห็นที่อยู่อีเมลของคุณ"}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{labels.showPhone || "แสดงเบอร์โทรในโปรไฟล์"}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{labels.phoneVisitors || "ผู้เข้าชมจะเห็นเบอร์โทรศัพท์ของคุณ"}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50/50">
                    <h3 className="text-base font-bold text-red-700">{labels.dangerZone || "Danger Zone"}</h3>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{labels.logout || "ออกจากระบบ"}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{labels.logoutDesc || "คุณจะถูกนำกลับไปยังหน้าหลัก"}</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="rounded-lg bg-red-50 border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                    >
                        {labels.logout || "ออกจากระบบ"}
                    </button>
                </div>
            </div>
        </div>
    );
}
