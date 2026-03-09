"use client";

import { useState, useEffect } from "react";
import { defaultTheme } from "@/components/ThemeProvider";
import { uploadImageToSupabase } from "@/lib/supabase";

export default function ThemeSettings() {
    const [theme, setTheme] = useState(defaultTheme);
    const [media, setMedia] = useState({ logo: "", heroImage: "", backgroundPattern: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTheme() {
            try {
                const res = await fetch("/api/profile/theme");
                if (res.ok) {
                    const data = await res.json();
                    if (data.themeConfig) {
                        setTheme({
                            colors: { ...defaultTheme.colors, ...(data.themeConfig.colors || {}) },
                            font: data.themeConfig.font || defaultTheme.font,
                            layout: { ...defaultTheme.layout, ...(data.themeConfig.layout || {}) }
                        });
                    }
                    if (data.mediaConfig) {
                        setMedia({
                            logo: data.mediaConfig.logo || "",
                            heroImage: data.mediaConfig.heroImage || "",
                            backgroundPattern: data.mediaConfig.backgroundPattern || ""
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching theme:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchTheme();
    }, []);

    const handleColorChange = (key: string, value: string) => {
        setTheme(prev => ({
            ...prev,
            colors: {
                ...(prev.colors as any),
                [key]: value
            }
        }));
        setSaved(false);
    };

    const handleFontChange = (value: string) => {
        setTheme(prev => ({
            ...prev,
            font: {
                heading: `var(--font-${value})`,
                body: `var(--font-${value})`
            }
        }));
        setSaved(false);
    };

    const handleMediaChange = (key: string, value: string) => {
        setMedia(prev => ({
            ...prev,
            [key]: value
        }));
        setSaved(false);
    };

    const handleFileUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show loading state for that specific image
        setSaving(true);
        setError("");

        try {
            const url = await uploadImageToSupabase(file, 'theme-media');
            handleMediaChange(key, url);
        } catch (err: any) {
            setError(`Upload failed: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleLayoutToggle = (key: string) => {
        setTheme(prev => ({
            ...prev,
            layout: {
                ...prev.layout,
                // @ts-ignore
                [key]: !prev.layout[key]
            }
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSaved(false);

        try {
            const res = await fetch("/api/profile/theme", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ themeConfig: theme, mediaConfig: media })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save theme");
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
        return <div className="animate-pulse flex space-x-4 p-6">กำลังโหลดการตั้งค่าธีม...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Color Palette Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-bold text-gray-900">Color Palette (โทนสี)</h3>
                    <p className="text-sm text-gray-500 mt-0.5">ปรับแต่งสีสันที่ใช้ในหน้าโปรไฟล์ของคุณ</p>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Primary Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color (สีหลัก)</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={theme.colors?.primary || "#000000"}
                                onChange={(e) => handleColorChange("primary", e.target.value)}
                                className="h-10 w-14 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.colors?.primary || ""}
                                onChange={(e) => handleColorChange("primary", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase"
                            />
                        </div>
                    </div>
                    {/* Secondary Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color (สีรอง)</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={theme.colors?.secondary || "#000000"}
                                onChange={(e) => handleColorChange("secondary", e.target.value)}
                                className="h-10 w-14 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.colors?.secondary || ""}
                                onChange={(e) => handleColorChange("secondary", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase"
                            />
                        </div>
                    </div>
                    {/* Accent Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color (สีเน้น)</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={theme.colors?.accent || "#000000"}
                                onChange={(e) => handleColorChange("accent", e.target.value)}
                                className="h-10 w-14 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.colors?.accent || ""}
                                onChange={(e) => handleColorChange("accent", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Typography Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-bold text-gray-900">Typography (ตัวอักษร)</h3>
                    <p className="text-sm text-gray-500 mt-0.5">เลือกรูปแบบตัวอักษรที่ต้องการใช้งานบนโปรไฟล์</p>
                </div>
                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                    <select
                        // @ts-ignore
                        value={(theme.font as any)?.body?.includes("prompt") ? "prompt" : (theme.font as any)?.body?.includes("sarabun") ? "sarabun" : "outfit"}
                        onChange={(e) => handleFontChange(e.target.value)}
                        className="w-full sm:w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                        <option value="outfit">Outfit (Modern English)</option>
                        <option value="prompt">Prompt (Modern Thai)</option>
                        <option value="sarabun">Sarabun (Official Thai)</option>
                    </select>
                </div>
            </div>

            {/* Media & Branding Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-bold text-gray-900">Media & Branding (รูปภาพและโลโก้)</h3>
                    <p className="text-sm text-gray-500 mt-0.5">ระบุ URL ของรูปภาพที่ต้องการใช้งาน (เว้นว่างไว้เพื่อใช้ค่าเริ่มต้น)</p>
                </div>
                <div className="p-6 space-y-6">
                    {/* Logo Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo (โลโก้บริษัท)</label>
                        <div className="flex items-center gap-4">
                            {media.logo && (
                                <div className="h-16 w-16 relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                                    <img src={media.logo} alt="Logo" className="object-contain w-full h-full" />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload("logo", e)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100 cursor-pointer"
                                    disabled={saving}
                                />
                                {media.logo && <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">{media.logo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Profile Image (รูปโปรไฟล์ส่วนหลัก)</label>
                        <div className="flex items-center gap-4">
                            {media.heroImage && (
                                <div className="h-20 w-16 relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                                    <img src={media.heroImage} alt="Hero" className="object-cover w-full h-full" />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload("heroImage", e)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100 cursor-pointer"
                                    disabled={saving}
                                />
                                {media.heroImage && <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">{media.heroImage}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Background Pattern */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Pattern (ภาพพื้นหลัง)</label>
                        <div className="flex items-center gap-4">
                            {media.backgroundPattern && (
                                <div className="h-16 w-24 relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                                    <img src={media.backgroundPattern} alt="Background" className="object-cover w-full h-full" />
                                </div>
                            )}
                            <div className="flex-1 space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload("backgroundPattern", e)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100 cursor-pointer"
                                    disabled={saving}
                                />
                                <div className="flex gap-2 isolate">
                                    <button
                                        type="button"
                                        onClick={() => handleMediaChange("backgroundPattern", "")}
                                        className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                                    >
                                        ลบภาพพื้นหลัง
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Toggles */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-bold text-gray-900">Layout (การแสดงผล)</h3>
                    <p className="text-sm text-gray-500 mt-0.5">เลือกเปิด/ปิดการแสดงผลแต่ละส่วนในหน้าโปรไฟล์</p>
                </div>
                <div className="p-6 space-y-4">
                    {[
                        { key: "showHero", label: "Hero Section (ส่วนแรกสุด)" },
                        { key: "showAbout", label: "About Section (วิสัยทัศน์/ประวัติ)" },
                        { key: "showServices", label: "Services Section (บริการ/ความเชี่ยวชาญ)" },
                        { key: "showClients", label: "Clients Section (ลูกค้า/พาร์ทเนอร์)" },
                        { key: "showExperience", label: "Experience Section (ประวัติการทำงาน)" },
                        { key: "showContact", label: "Contact Section (ช่องทางติดต่อ)" }
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-2">
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    // @ts-ignore
                                    checked={theme.layout[item.key]}
                                    onChange={() => handleLayoutToggle(item.key)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Action */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                    {saving ? "กำลังบันทึก..." : "อัปเดตธีม"}
                </button>
                {saved && (
                    <span className="text-sm text-green-600 font-medium">✔️ บันทึกการตั้งค่าธีมสำเร็จ</span>
                )}
                {error && (
                    <span className="text-sm text-red-500 font-medium">{error}</span>
                )}
            </div>
        </div>
    );
}
