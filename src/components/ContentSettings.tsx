"use client";

import { useState, useEffect } from "react";

export default function ContentSettings() {
    const [lang, setLang] = useState("th");
    const [content, setContent] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchContent() {
            setLoading(true);
            try {
                const res = await fetch(`/api/profile/content?lang=${lang}`);
                if (res.ok) {
                    const data = await res.json();
                    setContent(data.content || {});
                }
            } catch (err) {
                console.error("Error fetching content:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [lang]);

    const handleChange = (field: string, value: string) => {
        setContent((prev: any) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleNestedChange = (parent: string, field: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            [parent]: {
                ...(prev[parent] || {}),
                [field]: value
            }
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSaved(false);

        try {
            const res = await fetch("/api/profile/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lang, content })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save content");
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="animate-pulse flex space-x-4 p-6">กำลังโหลดข้อมูลข้อความ...</div>;
    }

    return (
        <div className="space-y-8 mt-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Content & Text (ข้อความบนเว็บไซต์)</h3>
                        <p className="text-sm text-gray-500 mt-0.5">เปลี่ยนข้อความต่างๆ บนโปรไฟล์ของคุณ (เว้นว่างไว้เพื่อใช้ค่าเริ่มต้น)</p>
                    </div>
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                        <option value="th">ไทย (TH)</option>
                        <option value="en">English (EN)</option>
                    </select>
                </div>

                <div className="p-6 space-y-6">
                    {/* Header Nav */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Navigation (เมนูด้านบน)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">เมนู: วิสัยทัศน์/ประวัติ</label>
                                <input type="text" value={content.navAbout || ""} onChange={(e) => handleChange("navAbout", e.target.value)} placeholder="เช่น ประวัติ" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">เมนู: บริการของเรา</label>
                                <input type="text" value={content.navServices || ""} onChange={(e) => handleChange("navServices", e.target.value)} placeholder="เช่น บริการของเรา" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">เมนู: ลูกค้าคนสำคัญ</label>
                                <input type="text" value={content.navCustomers || ""} onChange={(e) => handleChange("navCustomers", e.target.value)} placeholder="เช่น ลูกค้าคนสำคัญ" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">เมนู: สิ่งที่เรามองหา</label>
                                <input type="text" value={content.navLookingFor || ""} onChange={(e) => handleChange("navLookingFor", e.target.value)} placeholder="เช่น โอกาสทางธุรกิจ" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">เมนู: ติดต่อเรา</label>
                                <input type="text" value={content.navContact || ""} onChange={(e) => handleChange("navContact", e.target.value)} placeholder="เช่น ติดต่อเรา" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Hero Text */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Hero Section (ข้อความส่วนแรกรสุด)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Hero Badge (คำเล็กด้านบน)</label>
                                <input type="text" value={content.heroBadge || ""} onChange={(e) => handleChange("heroBadge", e.target.value)} placeholder="เช่น ผู้ก่อตั้งและซีอีโอ" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ชื่อ-นามสกุล (ขนาดใหญ่)</label>
                                <input type="text" value={content.heroName || ""} onChange={(e) => handleChange("heroName", e.target.value)} placeholder="เช่น สามารถ ไชยะ" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ชื่อบริษัท / Title (สีตัวเน้น)</label>
                                <input type="text" value={content.heroTitle || ""} onChange={(e) => handleChange("heroTitle", e.target.value)} placeholder="เช่น บริษัท แมน แมนเนจเม้นท์ เซอร์วิส จำกัด" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm text-gray-600 mb-1">คำคม / สโลแกนสั้นๆ (สีเทา)</label>
                                <textarea value={content.heroQuote || ""} onChange={(e) => handleChange("heroQuote", e.target.value)} placeholder="เช่น เราคือผู้เชี่ยวชาญด้าน..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={2}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ปุ่มซ้าย (ติดต่อ)</label>
                                <input type="text" value={content.heroContact || ""} onChange={(e) => handleChange("heroContact", e.target.value)} placeholder="เช่น ติดต่อเรา" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ปุ่มขวา (มาตรฐานของเรา)</label>
                                <input type="text" value={content.heroStandard || ""} onChange={(e) => handleChange("heroStandard", e.target.value)} placeholder="เช่น มาตรฐานของเรา" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>


                    {/* About Data JSON Edit */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">About Section (วิสัยทัศน์)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Badge เหนือวิสัยทัศน์</label>
                                <input type="text" value={content.aboutData?.visionBadge || ""} onChange={(e) => handleNestedChange("aboutData", "visionBadge", e.target.value)} placeholder="เช่น VISION & MISSION" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">หัวข้อวิสัยทัศน์</label>
                                <input type="text" value={content.aboutData?.visionTitle || ""} onChange={(e) => handleNestedChange("aboutData", "visionTitle", e.target.value)} placeholder="เช่น วิสัยทัศน์ของเรา" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm text-gray-600 mb-1">ข้อความวิสัยทัศน์ 1 (ตัวหนา)</label>
                                <textarea value={content.aboutData?.visionDesc1 || ""} onChange={(e) => handleNestedChange("aboutData", "visionDesc1", e.target.value)} placeholder="เช่น มุ่งเน้นความเป็นเลิศ..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={2}></textarea>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm text-gray-600 mb-1">ข้อความวิสัยทัศน์ 2 (อธิบายย่อย)</label>
                                <textarea value={content.aboutData?.visionDesc2 || ""} onChange={(e) => handleNestedChange("aboutData", "visionDesc2", e.target.value)} placeholder="เช่น พร้อมให้บริการเต็มรูปแบบ..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={2}></textarea>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50 transition-all"
                >
                    {saving ? "กำลังบันทึก..." : "อัปเดตข้อความ"}
                </button>
                {saved && (
                    <span className="text-sm text-green-600 font-medium">✔️ บันทึกข้อความสำเร็จ</span>
                )}
                {error && (
                    <span className="text-sm text-red-500 font-medium">{error}</span>
                )}
            </div>
        </div>
    );
}
