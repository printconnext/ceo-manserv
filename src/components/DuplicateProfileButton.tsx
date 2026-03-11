
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LANG_NAMES } from "@/data/locales";

interface DuplicateProfileButtonProps {
    profileId: string;
    profileName: string;
}

export default function DuplicateProfileButton({ profileId, profileName }: DuplicateProfileButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [targetLang, setTargetLang] = useState("en");
    const router = useRouter();

    const handleDuplicate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/profile/duplicate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sourceId: profileId, targetLang }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(`ทำสำเนาเป็นภาษา ${LANG_NAMES[targetLang]} เรียบร้อยแล้ว!`);
                setIsOpen(false);
                // Redirect to the new profile's editor
                router.push(`/dashboard/settings?id=${data.profileId}&lang=${targetLang.toLowerCase()}`);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการทำสำเนา");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-bold text-xs"
                title="ทำสำเนา (Duplicate)"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>ทำสำเนา</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">ทำสำเนาโปรไฟล์</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            คัดลอกข้อมูลของ <strong>{profileName}</strong> ไปยังภาษาใหม่ พร้อมแปลหัวข้อมาตรฐานให้อัตโนมัติ
                        </p>

                        <div className="space-y-4 mb-8">
                            <label className="block text-sm font-medium text-gray-700">เลือกภาษาปลายทาง</label>
                            <select
                                value={targetLang}
                                onChange={(e) => setTargetLang(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-900 bg-white"
                            >
                                {Object.entries(LANG_NAMES).map(([code, name]) => (
                                    <option key={code} value={code} className="text-gray-900 bg-white">
                                        {name} ({code.toUpperCase()})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleDuplicate}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-50"
                            >
                                {loading ? "กำลังสร้าง..." : "ยืนยันทำสำเนา"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
