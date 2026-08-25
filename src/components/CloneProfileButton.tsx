"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CloneProfileButtonProps {
    profileId: string;
    profileName: string;
}

export default function CloneProfileButton({ profileId, profileName }: CloneProfileButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [newName, setNewName] = useState("");
    const [newSlug, setNewSlug] = useState("");
    const [error, setError] = useState("");
    
    const router = useRouter();

    const handleNameBlur = () => {
        if (newName && !newSlug) {
            setNewSlug(newName.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/\s+/g, "-"));
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    };

    const handleClone = async () => {
        if (!newName.trim() || !newSlug.trim()) {
            setError("กรุณากรอกชื่อและ URL ใหม่ให้ครบถ้วน");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/profile/clone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sourceId: profileId, newName, newSlug }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(`คัดลอกสร้างบุคคลใหม่เรียบร้อยแล้ว!`);
                setIsOpen(false);
                setNewName("");
                setNewSlug("");
                // Refresh dashboard to show new profile
                router.refresh();
                // Then redirect to the new profile's editor (default to 'th' or whatever the first translation is)
                router.push(`/dashboard/settings?id=${data.profile.id}&lang=${data.firstLang || 'th'}`);
            } else {
                setError(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการคัดลอกสร้างบุคคลใหม่");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 hover:text-green-600 transition-colors"
                title="คัดลอกสร้างบุคคลใหม่ (Clone to New Person)"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">คัดลอกสร้างบุคคลใหม่</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            คัดลอกข้อมูลทุกภาษาและรูปแบบทั้งหมดของ <strong>{profileName}</strong> ไปเป็นพนักงานคนใหม่
                        </p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ-นามสกุล (คนใหม่)</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onBlur={handleNameBlur}
                                    placeholder="เช่น Nat Medhee"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-900 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL ของโปรไฟล์ (คนใหม่)</label>
                                <input
                                    type="text"
                                    value={newSlug}
                                    onChange={handleSlugChange}
                                    placeholder="เช่น nat-medhee"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-900 bg-white"
                                />
                            </div>

                            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleClone}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-50"
                            >
                                {loading ? "กำลังคัดลอก..." : "ยืนยันสร้าง"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
