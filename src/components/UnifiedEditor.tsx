"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { uploadImageToSupabase } from "@/lib/supabase";
import { defaultTheme } from "@/components/ThemeProvider";
import { ServiceIcons, defaultServiceIconOrder } from "./IconLibrary";
import VCardQR from "./VCardQR";
import { generateVCard } from "@/lib/vcard";
import { LOCALES, LANG_NAMES } from "@/data/locales";

const DEFAULT_CLIENTS = [
    { name: "KUBOTA", image: "kubota.png" }, { name: "SATI", "image": "sati.png" }, { name: "ATTG", "image": "attg.png" },
    { name: "HITACHI", "image": "hitachi.png" }, { name: "OGIHARA", "image": "ogihara.png" }, { name: "DONKI", "image": "donki.png" },
    { name: "YAMAHA", "image": "yamaha.png" }, { name: "HINO", "image": "hino.png" }, { name: "ICHIKOH", "image": "ichikoh.png" },
    { name: "TRA", "image": "tra.png" }, { name: "IDAKA", "image": "idaka.png" }, { name: "THK", "image": "thk.png" },
    { name: "THAI NAKANO", "image": "thai-nakano.png" }, { name: "UNIC", "image": "unic.png" }, { name: "TOR", "image": "tor.png" },
    { name: "PTS", "image": "pts.png" }, { name: "NISSINBO", "image": "nissinbo.png" }, { name: "DID", "image": "did.png" },
    { name: "TDK", "image": "tdk.png" }, { name: "HAS", "image": "has.png" }, { name: "SKMT", "image": "skmt.png" },
    { name: "BTKK", "image": "btkk.png" }, { name: "BEW", "image": "bew.png" }, { name: "FUKOKU", "image": "fukoku.png" },
    { name: "TRANSTEC", "image": "transtec.png" }, { name: "SHOWA", "image": "showa.png" }, { name: "IDAC", "image": "idac.png" },
    { name: "ENPLA", "image": "enpla.png" }, { name: "Y_AND_R", "image": "y_and_r.png" }, { name: "KANG YONG", "image": "kang-yong.png" },
    { name: "NISSAN", "image": "nissan.png" }, { name: "AKESONO", "image": "akesono.png" }, { name: "TAIHO", "image": "taiho.png" },
    { name: "E_AND_C", "image": "e_and_c.png" }, { name: "CPR", "image": "cpr.png" }, { name: "NIPPON EXPRSS", "image": "nippon-exprss.png" },
    { name: "TOSHIBA", "image": "toshiba.png" }, { name: "IKEA", "image": "ikea.png" }, { name: "INDARAMA", "image": "indarama.png" },
    { name: "DUSIT", "image": "dusit.png" }, { name: "AMCOGROUP", "image": "amcogroup.png" }, { name: "ALPHA GROUP", "image": "alpha-group.png" },
    { name: "CENTRAL", "image": "central.png" }, { name: "GREEN SPOT", "image": "green-spot.png" }, { name: "HISAMITSU", "image": "hisamitsu.png" }
];

const getSections = (lang: string) => {
    const labels = { ...LOCALES.en.editor, ...LOCALES[lang]?.editor };
    return [
        { id: "hero", label: labels.heroSection || "Hero Section" },
        { id: "about", label: labels.aboutSection || "About Section" },
        { id: "services", label: labels.servicesSection || "Services Section" },

        { id: "clients", label: labels.clientsSection || "Clients Section" },
        { id: "contact", label: labels.contactSection || "Contact Section" },
        { id: "aesthetics", label: labels.aestheticsSection || "Aesthetics" },
    ];
};

export default function UnifiedEditor({
    lang: externalLang,
    onLangChange
}: {
    lang?: string,
    onLangChange?: (l: string) => void
}) {
    const { data: session } = useSession();
    const [activeSection, setActiveSection] = useState("hero");
    const [internalLang, setInternalLang] = useState("th");

    // Use external lang if provided, otherwise internal
    const lang = externalLang || internalLang;
    const setLang = (l: string) => {
        if (onLangChange) onLangChange(l);
        else setInternalLang(l);
    };

    // Initialize lang from URL if present
    useEffect(() => {
        const searchParams = new URL(window.location.href).searchParams;
        const urlLang = searchParams.get("lang");
        if (urlLang && LOCALES[urlLang]) {
            setLang(urlLang);
        }
    }, []);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [profileId, setProfileId] = useState<string | null>(null);
    const [showQR, setShowQR] = useState(false);
    const [profileMetadata, setProfileMetadata] = useState<any>(null);
    const [existingLangs, setExistingLangs] = useState<string[]>([]);

    // State for all data
    const [theme, setTheme] = useState<any>(defaultTheme);
    const [media, setMedia] = useState<any>({ logo: "", heroImage: "", backgroundPattern: "", badges: [], heroGallery: [] });
    const [content, setContent] = useState<any>({});

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const searchParams = new URL(window.location.href).searchParams;
                const pid = searchParams.get("id");
                setProfileId(pid);

                // Fetch Theme & Media
                const themeUrl = pid ? `/api/profile/theme?id=${pid}` : "/api/profile/theme";
                const themeRes = await fetch(themeUrl);
                if (themeRes.ok) {
                    const themeData = await themeRes.json();
                    if (themeData.themeConfig) setTheme(themeData.themeConfig);
                    if (themeData.mediaConfig) {
                        setMedia({
                            logo: themeData.mediaConfig.logo || "",
                            heroImage: themeData.mediaConfig.heroImage || "",
                            backgroundPattern: themeData.mediaConfig.backgroundPattern || "",
                            badges: Array.isArray(themeData.mediaConfig.badges) ? themeData.mediaConfig.badges : [],
                            heroGallery: Array.isArray(themeData.mediaConfig.heroGallery) ? themeData.mediaConfig.heroGallery : []
                        });
                    }
                }

                // Fetch Content for current language
                const contentUrl = pid ? `/api/profile/content?lang=${lang}&id=${pid}` : `/api/profile/content?lang=${lang}`;
                const contentRes = await fetch(contentUrl);
                if (contentRes.ok) {
                    const contentData = await contentRes.json();
                    setProfileMetadata(contentData.profileMetadata); // Store slugs for URL generation
                    setExistingLangs(contentData.existingLangs || []);
                    const fetchedContent = contentData.content || {};

                    // Inject default mockups for clients if empty
                    if (!fetchedContent.clientsData) {
                        fetchedContent.clientsData = {};
                    }
                    if (!fetchedContent.clientsData.items || fetchedContent.clientsData.items.length === 0) {
                        fetchedContent.clientsData.items = DEFAULT_CLIENTS;
                    }

                    // Pre-fill contact data from profile if empty
                    const profileData = contentData.profileData;
                    if (!fetchedContent.contactData) fetchedContent.contactData = {};
                    const cd = fetchedContent.contactData;

                    // Normalize old DB keys (officeValue, mobileValue, etc.) to editor keys
                    if (!cd.office && cd.officeValue) cd.office = cd.officeValue;
                    if (!cd.office && cd.address) cd.office = cd.address;
                    if (!cd.mobile && cd.mobileValue) cd.mobile = cd.mobileValue;
                    if (!cd.email && cd.emailValue) cd.email = cd.emailValue;
                    if (!cd.website && cd.websiteValue) cd.website = cd.websiteValue;
                    if (!cd.lineTitle && cd.lineValue) cd.lineTitle = cd.lineValue;

                    // Fallback to profile-level data if still empty
                    if (profileData) {
                        if (!cd.lineTitle && profileData.lineUrl) cd.lineTitle = profileData.lineUrl;
                        if (!cd.mobile && profileData.phone1) cd.mobile = profileData.phone1;
                        if (!cd.email && profileData.email) cd.email = profileData.email;
                        if (!cd.website && profileData.website) cd.website = profileData.website;
                    }

                    setContent(fetchedContent);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [lang]);

    const handleContentChange = (field: string, value: any) => {
        setContent((prev: any) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setContent((prev: any) => ({
            ...prev,
            [parent]: {
                ...(typeof prev[parent] === 'object' && !Array.isArray(prev[parent]) ? prev[parent] : {}),
                [field]: value
            }
        }));
        setSaved(false);
    };

    // Robust Array Item Change that handles nested objects correctly
    const handleArrayItemChange = (parent: string, index: number, field: string, value: any, arrayKey: string = "items") => {
        setContent((prev: any) => {
            const parentObj = { ...(typeof prev[parent] === 'object' && !Array.isArray(prev[parent]) ? prev[parent] : {}) };
            const currentArray = Array.isArray(parentObj[arrayKey]) ? [...parentObj[arrayKey]] : [];

            // Ensure array has enough elements
            while (currentArray.length <= index) {
                currentArray.push({});
            }

            const item = typeof currentArray[index] === 'object' ? { ...currentArray[index] } : {};
            item[field] = value;
            currentArray[index] = item;

            return {
                ...prev,
                [parent]: {
                    ...parentObj,
                    [arrayKey]: currentArray
                }
            };
        });
        setSaved(false);
    };

    const removeArrayItem = (parent: string, index: number, arrayKey: string = "items") => {
        setContent((prev: any) => {
            const parentObj = prev[parent] || {};
            const currentArray = Array.isArray(parentObj[arrayKey]) ? [...parentObj[arrayKey]] : [];
            currentArray.splice(index, 1);
            return {
                ...prev,
                [parent]: {
                    ...parentObj,
                    [arrayKey]: currentArray
                }
            };
        });
        setSaved(false);
    };

    const handleArrayStringChange = (parent: string, arrayKey: string, index: number, value: string) => {
        setContent((prev: any) => {
            const parentObj = prev[parent] || {};
            const currentArray = Array.isArray(parentObj[arrayKey]) ? [...parentObj[arrayKey]] : [];
            currentArray[index] = value;
            return {
                ...prev,
                [parent]: {
                    ...parentObj,
                    [arrayKey]: currentArray
                }
            };
        });
        setSaved(false);
    };

    const addArrayStringItem = (parent: string, arrayKey: string, initialValue: string = "") => {
        setContent((prev: any) => {
            const parentObj = prev[parent] || {};
            const currentArray = Array.isArray(parentObj[arrayKey]) ? [...parentObj[arrayKey]] : [];
            currentArray.push(initialValue);
            return {
                ...prev,
                [parent]: {
                    ...parentObj,
                    [arrayKey]: currentArray
                }
            };
        });
        setSaved(false);
    };

    const addArrayItem = (parent: string, initialValue: any = {}, arrayKey: string = "items") => {
        setContent((prev: any) => {
            const parentObj = { ...(typeof prev[parent] === 'object' && !Array.isArray(prev[parent]) ? prev[parent] : {}) };
            const currentArray = Array.isArray(parentObj[arrayKey]) ? [...parentObj[arrayKey]] : [];
            currentArray.push(initialValue);
            return {
                ...prev,
                [parent]: {
                    ...parentObj,
                    [arrayKey]: currentArray
                }
            };
        });
        setSaved(false);
    };

    const removeArrayStringItem = (parent: string, arrayKey: string, index: number) => {
        setContent((prev: any) => {
            const parentObj = prev[parent] || {};
            const currentArray = Array.isArray(parentObj[arrayKey]) ? [...parentObj[arrayKey]] : [];
            currentArray.splice(index, 1);
            return {
                ...prev,
                [parent]: {
                    ...parentObj,
                    [arrayKey]: currentArray
                }
            };
        });
        setSaved(false);
    };

    const handleMediaChange = (field: string, value: any) => {
        setMedia((prev: any) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleThemeChange = (field: string, value: any) => {
        setTheme((prev: any) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleColorChange = (key: string, value: string) => {
        setTheme((prev: any) => ({
            ...prev,
            colors: { ...(prev.colors || {}), [key]: value }
        }));
        setSaved(false);
    };

    const handleLayoutToggle = (section: string) => {
        setTheme((prev: any) => ({
            ...prev,
            layout: { ...(prev.layout || {}), [section]: !prev.layout?.[section] }
        }));
        setSaved(false);
    };

    const handleFileUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>, isArray: boolean = false, index: number = -1) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        setError("");

        try {
            const url = await uploadImageToSupabase(file, 'profile-media');
            if (isArray && index !== -1) {
                const newArr = Array.isArray(media[key]) ? [...media[key]] : [];
                if (key === 'badges') {
                    newArr[index] = { src: url, alt: `Badge ${index + 1}` };
                } else {
                    newArr[index] = url;
                }
                handleMediaChange(key, newArr);
            } else {
                handleMediaChange(key, url);
            }
        } catch (err: any) {
            setError(`Upload failed: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleContentImageUpload = async (parent: string, arrayKey: string, index: number, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        setError("");

        try {
            const url = await uploadImageToSupabase(file, 'profile-media');
            handleArrayItemChange(parent, index, field, url, arrayKey);
        } catch (err: any) {
            setError(`Upload failed: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSaved(false);

        try {
            const themeRes = await fetch("/api/profile/theme", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    themeConfig: theme,
                    mediaConfig: media,
                    id: profileId || undefined
                })
            });

            if (!themeRes.ok) {
                const themeErr = await themeRes.json().catch(() => ({ error: "Unknown theme error" }));
                throw new Error(`Theme: ${themeErr.error || "Failed to save theme"}`);
            }

            // Clean content to remove Prisma system fields before saving
            const { id: contentId, profileId: contentProfileId, lang: l, createdAt, updatedAt, ...cleanContent } = content;

            const contentRes = await fetch("/api/profile/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lang,
                    content: cleanContent,
                    id: profileId || undefined
                })
            });

            if (!contentRes.ok) {
                const contentErr = await contentRes.json().catch(() => ({ error: "Unknown content error" }));
                throw new Error(`Content: ${contentErr.error || "Failed to save content"}`);
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const labels = { ...LOCALES.en.editor, ...LOCALES[lang]?.editor };
    const currentSections = getSections(lang);

    if (loading) return <div className="p-8 text-center animate-pulse text-gray-500 font-bold uppercase tracking-widest">{labels.loading || "กำลังโหลด..."}</div>;

    const SectionHeader = ({ title, desc, layoutKey }: { title: string, desc: string, layoutKey?: string }) => (
        <div className="flex justify-between items-start mb-8 border-b pb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </div>
            {layoutKey && (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{labels.showSection || "แสดงส่วนนี้"}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={theme.layout?.[layoutKey] ?? true} onChange={() => handleLayoutToggle(layoutKey)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4 flex flex-col gap-1">
                {currentSections.map((s: any) => (
                    <button
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className={`text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeSection === s.id
                            ? "bg-brand-blue text-white shadow-xl shadow-blue-100 translate-x-1"
                            : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        {s.label}
                    </button>
                ))}

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                    <button
                        onClick={() => setShowQR(true)}
                        className="w-full rounded-2xl border-2 border-amber-500 py-3 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                        {labels.viewQRCode || "ดู QR Code นามบัตร"}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full rounded-2xl bg-brand-blue py-4 text-sm font-bold text-white shadow-xl shadow-blue-100 hover:bg-blue-800 disabled:opacity-50 transition-all uppercase tracking-widest"
                    >
                        {saving ? labels.saving : labels.updateWebsite || "อัปเดตเว็บไซต์"}
                    </button>

                    {profileMetadata?.orgSlug && profileMetadata?.profileSlug && (
                        <a
                            href={`/${profileMetadata.orgSlug}/${profileMetadata.profileSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full rounded-2xl border-2 border-brand-blue py-3.5 text-sm font-bold text-brand-blue hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            {labels.viewSite || "เปิดหน้าเว็บไซต์"}
                        </a>
                    )}

                    {saved && <p className="text-center text-xs text-green-600 mt-3 font-bold animate-bounce">✔️ {labels.success || "บันทึกสำเร็จ!"}</p>}
                    {error && <p className="text-center text-xs text-red-500 mt-3 font-medium">{error}</p>}
                </div>
            </div>

            {/* QR Modal Overlay */}
            {showQR && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
                        <VCardQR
                            fullName={content.heroName || "CEO Profile"}
                            portraitUrl={media.heroImage || undefined}
                            primaryColor={theme.colors?.primary || "#00318C"}
                            onClose={() => setShowQR(false)}
                            vCardString={generateVCard({
                                fullName: content.heroName || "",
                                title: content.heroRole || "",
                                organization: content.heroTitle || "",
                                phone1: content.contactData?.mobile || "",
                                email: content.contactData?.email || "",
                                website: content.contactData?.website || "",
                                profileUrl: profileMetadata ? `https://www.ceoprofile.site/${profileMetadata.orgSlug}/${profileMetadata.profileSlug}/th` : ""
                            })}
                        />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="lg:w-3/4 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden min-h-[700px]">
                <div className="p-8 lg:p-12">

                    {activeSection === "hero" && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <SectionHeader title={labels.heroSection || "Hero Section"} desc={labels.heroSectionDesc || "จัดการข้อมูลและรูปภาพในส่วนแรกของเว็บไซต์"} layoutKey="showHero" />

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-12 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-sm">
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.heroBadgeLabel || "Badge"}</label>
                                            <input type="text" value={content.heroBadge || ""} onChange={(e) => handleContentChange("heroBadge", e.target.value)} className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue" placeholder={labels.heroBadgePlace || "เช่น ผู้ก่อตั้งและซีอีโอ"} />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.heroNameLabel || "ชื่อ-นามสกุล"}</label>
                                            <input type="text" value={content.heroName || ""} onChange={(e) => handleContentChange("heroName", e.target.value)} className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue" placeholder={labels.heroNamePlace || "เช่น สามารถ ไชยะ"} />
                                        </div>
                                        <div className="col-span-full space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.heroOrgLabel || "ชื่อองค์กร/บริษัท"}</label>
                                            <input type="text" value={content.heroTitle || ""} onChange={(e) => handleContentChange("heroTitle", e.target.value)} className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue" placeholder={labels.heroOrgPlace || "เช่น บริษัท แมน แมนเนจเม้นท์ เซอร์วิส จำกัด"} />
                                        </div>
                                        <div className="col-span-full space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.heroQuoteLabel || "คำคม/สโลแกน (Quote)"}</label>
                                            <textarea value={content.heroQuote || ""} onChange={(e) => handleContentChange("heroQuote", e.target.value)} className="w-full rounded-2xl border-none p-6 text-sm font-medium shadow-sm focus:ring-2 focus:ring-brand-blue leading-relaxed" rows={3} placeholder={labels.heroQuotePlace || "เช่น \"เราคือ ผู้นำเชี่ยวชาญด้านการเดินทาง...\""} />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.heroContactBtnLabel || "ปุ่มติดต่อเรา"}</label>
                                            <input type="text" value={content.heroContactBtn || ""} onChange={(e) => handleContentChange("heroContactBtn", e.target.value)} className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue" placeholder={labels.heroContactBtnPlace || "เช่น Contact Us"} />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.heroStandardBtnLabel || "ปุ่มมาตรฐานของเรา"}</label>
                                            <input type="text" value={content.heroStandardBtn || ""} onChange={(e) => handleContentChange("heroStandardBtn", e.target.value)} className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue" placeholder={labels.heroStandardBtnPlace || "เช่น Our Standard"} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-400 uppercase ml-1">{labels.websiteLogo || "Website Logo"}</label>
                                            <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden group hover:border-brand-blue transition-colors cursor-pointer shadow-sm">
                                                {media.logo ? <img src={media.logo} className="h-full w-full object-contain p-4" /> : <span className="text-[10px] text-gray-400 font-bold uppercase">Logo</span>}
                                                <input type="file" onChange={(e) => handleFileUpload("logo", e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-400 uppercase ml-1">{labels.portraitProfile || "Portrait Profile"}</label>
                                            <div className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden group hover:border-brand-blue transition-colors cursor-pointer shadow-sm">
                                                {media.heroImage ? <img src={media.heroImage} className="h-full w-full object-cover" /> : <span className="text-[10px] text-gray-400 font-bold uppercase">{labels.portrait || "Portrait"}</span>}
                                                <input type="file" onChange={(e) => handleFileUpload("heroImage", e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4">
                                        <label className="block text-xs font-bold text-blue-800 uppercase ml-1">{labels.standardBadges || "Standard Badges (2 Slots)"}</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[0, 1].map((idx) => (
                                                <div key={idx} className="relative aspect-square rounded-2xl border-2 border-dashed border-blue-200 flex items-center justify-center bg-white overflow-hidden group hover:border-brand-blue transition-colors cursor-pointer shadow-sm">
                                                    {media.badges?.[idx]?.src ? <img src={media.badges[idx].src} className="h-full w-full object-contain p-4" /> : <span className="text-[10px] text-blue-300 font-bold uppercase">{labels.badge || "Badge"} {idx + 1}</span>}
                                                    <input type="file" onChange={(e) => handleFileUpload("badges", e, true, idx)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Gallery Section (merged into Hero) */}
                                <div className="mt-10 space-y-4 xl:col-span-2">
                                    <h4 className="text-sm font-bold text-gray-900 border-l-4 border-brand-orange pl-3 uppercase tracking-widest">{labels.businessGallery || "Business Gallery (รูปภาพกิจการ สูงสุด 4 รูป)"}</h4>
                                    <div className="grid grid-cols-4 gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                        {[0, 1, 2, 3].map((idx) => (
                                            <div key={idx} className="relative aspect-[4/3] bg-gray-50 overflow-hidden group cursor-pointer">
                                                {media.heroGallery?.[idx] ? <img src={media.heroGallery[idx]} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center"><span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{labels.photo || "Photo"} {idx + 1}</span></div>}
                                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload("heroGallery", e, true, idx)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-white text-[9px] font-bold uppercase tracking-widest">{media.heroGallery?.[idx] ? labels.change || "Change" : labels.upload || "Upload"}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "about" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <SectionHeader title={labels.aboutSection || "About Section"} desc={labels.aboutSectionDesc || "วิสัยทัศน์ และตัวเลขความสำเร็จ"} layoutKey="showAbout" />

                            <div className="grid grid-cols-1 gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{labels.visionBadge || "Vision Badge"}</label>
                                        <input type="text" value={content.aboutData?.visionBadge || ""} onChange={(e) => handleNestedChange("aboutData", "visionBadge", e.target.value)} className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm" placeholder="เช่น VISION & MISSION" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{labels.visionTitle || "Vision Title"}</label>
                                        <input type="text" value={content.aboutData?.visionTitle || ""} onChange={(e) => handleNestedChange("aboutData", "visionTitle", e.target.value)} className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{labels.desc1 || "Description 1 (ข้อความเน้น)"}</label>
                                        <textarea value={content.aboutData?.visionDesc1 || ""} onChange={(e) => handleNestedChange("aboutData", "visionDesc1", e.target.value)} className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm" rows={4} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{labels.desc2 || "Description 2 (รายละเอียดสมทบ)"}</label>
                                        <textarea value={content.aboutData?.visionDesc2 || ""} onChange={(e) => handleNestedChange("aboutData", "visionDesc2", e.target.value)} className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm" rows={4} />
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-6">
                                    <div className="flex justify-between items-center border-l-4 border-brand-blue pl-3">
                                        <h4 className="text-sm font-bold text-gray-900">{labels.statsNumbers || "Stats Numbers (สถิติความสำเร็จ)"}</h4>
                                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm scale-90 origin-right">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{labels.showSection || "แสดงส่วนนี้"}</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={theme.layout?.showAboutStats ?? true} onChange={() => handleLayoutToggle("showAboutStats")} className="sr-only peer" />
                                                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[0, 1, 2, 3].map((idx) => (
                                            <div key={idx} className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={content.aboutData?.stats?.[idx]?.label || ""}
                                                    onChange={(e) => handleArrayItemChange("aboutData", idx, "label", e.target.value, "stats")}
                                                    className="w-full rounded-xl border-none bg-white p-3 text-[10px] font-bold uppercase text-gray-400 text-center shadow-sm"
                                                    placeholder="Label"
                                                />
                                                <input
                                                    type="text"
                                                    value={content.aboutData?.stats?.[idx]?.value || ""}
                                                    onChange={(e) => handleArrayItemChange("aboutData", idx, "value", e.target.value, "stats")}
                                                    className="w-full rounded-xl border-none bg-white p-3 text-lg font-bold text-brand-blue text-center shadow-sm"
                                                    placeholder="15+"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "services" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <SectionHeader title={labels.servicesSection || "Services Section"} desc={labels.servicesSectionDesc || "บริการและความเชี่ยวชาญ"} layoutKey="showServices" />
                            <div className="grid grid-cols-1 gap-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{labels.servicesTitleLabel || "Section Title"}</label>
                                        <input type="text" value={content.servicesData?.title || ""} onChange={(e) => handleNestedChange("servicesData", "title", e.target.value)} className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{labels.servicesSubtitleLabel || "Section Subtitle"}</label>
                                        <input type="text" value={content.servicesData?.subtitle || ""} onChange={(e) => handleNestedChange("servicesData", "subtitle", e.target.value)} className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
                                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                                        <div key={idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 hover:border-brand-blue transition-colors">
                                            {/* Service Image Upload */}
                                            <div className="relative h-32 w-full bg-white rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden group hover:border-brand-blue transition-colors cursor-pointer shadow-sm">
                                                {content.servicesData?.items?.[idx]?.image ? (
                                                    <img src={content.servicesData.items[idx].image} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-brand-blue transition-colors">
                                                        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">{labels.serviceImage || "Service Image"}</span>
                                                    </div>
                                                )}
                                                <input type="file" onChange={(e) => handleContentImageUpload("servicesData", "items", idx, "image", e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">{idx + 1}</span>
                                                <input
                                                    type="text"
                                                    value={content.servicesData?.items?.[idx]?.title || ""}
                                                    onChange={(e) => handleArrayItemChange("servicesData", idx, "title", e.target.value)}
                                                    className="flex-grow rounded-xl border-none bg-white p-2 text-sm font-bold shadow-sm"
                                                    placeholder={labels.serviceTitle || "Service Title"}
                                                />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* Left pill */}
                                                <div className="flex items-center bg-white rounded-2xl px-3 py-1.5 flex-grow shadow-sm border border-gray-100 relative">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-2 ml-1">Icon</span>
                                                    <select
                                                        value={(() => {
                                                            const raw = content.servicesData?.items?.[idx]?.icon || defaultServiceIconOrder[idx % defaultServiceIconOrder.length];
                                                            const legacyIconMap: Record<string, string> = { car: 'user', crown: 'van', shield: 'location', plane: 'globe' };
                                                            return legacyIconMap[raw] || raw;
                                                        })()}
                                                        onChange={(e) => handleArrayItemChange("servicesData", idx, "icon", e.target.value)}
                                                        className="flex-grow bg-transparent border-none p-0 text-sm font-semibold text-brand-blue focus:ring-0 cursor-pointer appearance-none pr-6"
                                                        style={{
                                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                                            backgroundPosition: `right 0.2rem center`,
                                                            backgroundSize: `1.2em 1.2em`,
                                                            backgroundRepeat: 'no-repeat'
                                                        }}
                                                    >
                                                        {Object.keys(ServiceIcons).map(iconKey => (
                                                            <option key={iconKey} value={iconKey}>{iconKey.charAt(0).toUpperCase() + iconKey.slice(1)}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Right icon box */}
                                                <div className="w-10 h-10 flex text-teal-700 bg-teal-50/50 rounded-xl items-center justify-center p-2 shadow-sm border border-teal-50 flex-shrink-0">
                                                    {(() => {
                                                        const raw = content.servicesData?.items?.[idx]?.icon || defaultServiceIconOrder[idx % defaultServiceIconOrder.length];
                                                        const legacyIconMap: Record<string, string> = { car: 'user', crown: 'van', shield: 'location', plane: 'globe' };
                                                        const resolved = legacyIconMap[raw] || raw;
                                                        return React.createElement(ServiceIcons[resolved] || ServiceIcons.star, { className: 'w-full h-full' });
                                                    })()}
                                                </div>
                                            </div>
                                            <textarea
                                                value={content.servicesData?.items?.[idx]?.description || ""}
                                                onChange={(e) => handleArrayItemChange("servicesData", idx, "description", e.target.value)}
                                                className="w-full rounded-xl border-none bg-white p-3 text-xs text-gray-500 shadow-sm"
                                                rows={3}
                                                placeholder={labels.descriptionPlace || "Description..."}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}



                    {activeSection === "contact" && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <SectionHeader title={labels.contactSection || "Contact Section"} desc={labels.contactSectionDesc || "ช่องทางการติดต่อและโซเชียลมีเดีย"} layoutKey="showContact" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{labels.servicesTitleLabel || "Section Title"}</label>
                                        <input type="text" value={content.contactData?.title || ""} onChange={(e) => handleNestedChange("contactData", "title", e.target.value)} className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{labels.servicesSubtitleLabel || "Section Subtitle"}</label>
                                        <input type="text" value={content.contactData?.subtitle || ""} onChange={(e) => handleNestedChange("contactData", "subtitle", e.target.value)} className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.officeAddress || "Office Address"}</label>
                                        <textarea value={content.contactData?.office || content.contactData?.officeValue || ""} onChange={(e) => handleNestedChange("contactData", "office", e.target.value)} className="w-full rounded-2xl border-none p-6 text-sm font-medium shadow-sm focus:ring-2 focus:ring-brand-blue leading-relaxed" rows={2} placeholder="Address..." />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.mobilePhone || "Mobile Phone"}</label>
                                            <input type="text" value={content.contactData?.mobile || content.contactData?.mobileValue || ""} onChange={(e) => handleNestedChange("contactData", "mobile", e.target.value)} className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue" placeholder="Phone..." />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.email || "Email"}</label>
                                            <input type="text" value={content.contactData?.email || content.contactData?.emailValue || ""} onChange={(e) => handleNestedChange("contactData", "email", e.target.value)} className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue" placeholder="Email..." />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.website || "Website"}</label>
                                            <input type="text" value={content.contactData?.website || content.contactData?.websiteValue || ""} onChange={(e) => handleNestedChange("contactData", "website", e.target.value)} className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue" placeholder="Website URL..." />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{labels.lineId || "Line ID / Add Line Link"}</label>
                                            <input type="text" value={content.contactData?.lineTitle || content.contactData?.lineValue || ""} onChange={(e) => handleNestedChange("contactData", "lineTitle", e.target.value)} className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue" placeholder="Line Link..." />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "aesthetics" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <SectionHeader title={labels.visualTheme || "Visual Theme"} desc={labels.visualThemeDesc || "ปรับแต่งสีสันและอารมณ์ของโปรไฟล์ให้เป็นเอกลักษณ์"} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-gray-900 border-l-4 border-brand-blue pl-3 uppercase tracking-widest">{labels.colorPalette || "Color Palette"}</h4>
                                    <div className="p-10 bg-gray-50 rounded-[3rem] space-y-8 border border-gray-100 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-3xl -mr-10 -mt-10"></div>
                                        <div className="space-y-4 relative">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest text-center">{labels.brandPrimaryColor || "Brand Primary Color"}</label>
                                            <div className="flex flex-col items-center gap-6">
                                                <div
                                                    className="w-32 h-32 rounded-full shadow-2xl ring-[12px] ring-white transition-all duration-500 scale-110"
                                                    style={{ backgroundColor: theme.colors?.primary || "#00318C" }}
                                                ></div>
                                                <div className="flex w-full items-center gap-4">
                                                    <input type="color" value={theme.colors?.primary || "#00318C"} onChange={(e) => handleColorChange("primary", e.target.value)} className="h-14 w-20 rounded-2xl cursor-pointer border-none shadow-md overflow-hidden bg-transparent" />
                                                    <input type="text" value={theme.colors?.primary || ""} onChange={(e) => handleColorChange("primary", e.target.value)} className="flex-grow rounded-2xl border-gray-200 bg-white font-mono text-center text-sm font-bold uppercase p-4 shadow-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-gray-900 border-l-4 border-brand-blue pl-3 uppercase tracking-widest">{labels.uiElements || "UI Elements"}</h4>
                                    <div className="p-8 bg-gray-50 rounded-[3rem] space-y-10 border border-gray-100 shadow-xl flex flex-col justify-center">
                                        <div className="space-y-6">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest text-center">{labels.buttonShape || "Interactive Button Shape"}</label>
                                            <div className="grid grid-cols-1 gap-4">
                                                {["rounded", "pill", "square"].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleThemeChange("buttonStyle", s)}
                                                        className={`py-5 text-sm font-bold rounded-2xl border-2 transition-all duration-300 transform ${theme.buttonStyle === s ? "bg-brand-blue border-brand-blue text-white shadow-2xl -translate-y-1" : "bg-white border-gray-100 text-gray-400 hover:border-blue-100"}`}
                                                        style={{ borderRadius: s === 'pill' ? '9999px' : s === 'square' ? '0px' : '1.5rem' }}
                                                    >
                                                        {s.toUpperCase()} STYLE
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {activeSection === "clients" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <SectionHeader title={labels.clientsSection || "Clients Section"} desc={labels.clientsSectionDesc || "ลูกค้าคนสำคัญและกลุ่มเป้าหมาย"} layoutKey="showClients" />

                            {/* Section 1: Key Customers (Logos) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6 md:col-span-2">
                                    <h4 className="flex items-center justify-between text-base font-bold text-gray-900 border-l-4 border-brand-blue pl-3 uppercase tracking-widest">
                                        {labels.clientLogos || "Client Logos"}
                                        <button onClick={() => addArrayItem("clientsData", { name: "", image: "" }, "items")} className="px-5 py-2.5 bg-brand-blue text-white rounded-2xl text-xs font-extrabold hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                            {labels.addClientLogo || "+ เพิ่มโลโก้ลูกค้า"}
                                        </button>
                                    </h4>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-gray-50 p-6 rounded-[2rem]">
                                        {content.clientsData?.items?.map((client: any, idx: number) => (
                                            <div key={idx} className="relative group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow">
                                                <button
                                                    onClick={() => removeArrayItem("clientsData", idx)}
                                                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    title="Remove Client"
                                                >
                                                    ✖
                                                </button>

                                                <div className="relative w-full h-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-dashed border-gray-200 group-hover:border-brand-blue transition-colors">
                                                    {client.image ? (
                                                        <Image src={client.image.startsWith('http') ? client.image : `/images/customers/${client.image}`} alt={client.name || "Client"} fill className="object-contain p-2" unoptimized />
                                                    ) : (
                                                        <div className="text-gray-400 text-[10px] font-semibold flex flex-col items-center">
                                                            <span>{labels.uploadLogo || "Upload Logo"}</span>
                                                        </div>
                                                    )}
                                                    <input type="file" onChange={(e) => handleContentImageUpload("clientsData", "items", idx, "image", e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={client.name || ""}
                                                    onChange={(e) => handleArrayItemChange("clientsData", idx, "name", e.target.value)}
                                                    className="w-full text-center border-none bg-transparent text-xs font-semibold p-1 focus:ring-0 text-gray-700"
                                                    placeholder={labels.clientName || "Client Name"}
                                                />
                                            </div>
                                        ))}
                                        {(!content.clientsData?.items || content.clientsData.items.length === 0) && (
                                            <div className="col-span-full py-8 text-center text-sm font-semibold text-gray-400">
                                                {lang === 'en' ? 'No client logos yet. Click "+ Add Client Logo" above to add.' : 'ยังไม่มีโลโก้ลูกค้า กดปุ่ม "+ เพิ่มโลโก้ลูกค้า" ด้านบนเพื่อเพิ่ม'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Text Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-gray-900 border-l-4 border-brand-blue pl-3 uppercase tracking-widest">{labels.clientsKeyTitleLabel || "Key Customers Text"}</h4>
                                    <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4 border border-gray-100">
                                        <input type="text" value={content.clientsData?.keyCustomersBadge || ""} onChange={(e) => handleNestedChange("clientsData", "keyCustomersBadge", e.target.value)} className="w-full rounded-2xl border-none p-4 text-sm font-bold shadow-sm text-brand-blue" placeholder={labels.clientsKeyBadgeLabel || "Badge e.g. KEY CUSTOMERS"} />
                                        <input type="text" value={content.clientsData?.keyCustomersTitle || ""} onChange={(e) => handleNestedChange("clientsData", "keyCustomersTitle", e.target.value)} className="w-full rounded-2xl border-none p-4 text-sm font-bold shadow-sm" placeholder="Title" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-gray-900 border-l-4 border-brand-blue pl-3 uppercase tracking-widest">{labels.clientsLookTitleLabel || "Looking For Text"}</h4>
                                    <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4 border border-gray-100">
                                        <input type="text" value={content.clientsData?.lookingForBadge || ""} onChange={(e) => handleNestedChange("clientsData", "lookingForBadge", e.target.value)} className="w-full rounded-2xl border-none p-4 text-sm font-bold shadow-sm text-brand-blue" placeholder={labels.clientsLookBadgeLabel || "Badge e.g. LOOKING FOR"} />
                                        <input type="text" value={content.clientsData?.lookingForTitle || ""} onChange={(e) => handleNestedChange("clientsData", "lookingForTitle", e.target.value)} className="w-full rounded-2xl border-none p-4 text-sm font-bold shadow-sm" placeholder="Title" />
                                        <textarea value={content.clientsData?.lookingForDesc || ""} onChange={(e) => handleNestedChange("clientsData", "lookingForDesc", e.target.value)} className="w-full rounded-xl border-none bg-white p-4 text-xs shadow-sm" rows={2} placeholder={labels.clientsLookDescLabel || "Description..."} />

                                        <div className="pt-4 space-y-3">
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{labels.itemsList || "Items List"}</div>
                                            {(content.clientsData?.lookingForItems || []).map((itemStr: string, idx: number) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={itemStr}
                                                        onChange={(e) => handleArrayStringChange("clientsData", "lookingForItems", idx, e.target.value)}
                                                        className="flex-grow rounded-xl border-none p-3 text-xs shadow-sm"
                                                    />
                                                    <button onClick={() => removeArrayStringItem("clientsData", "lookingForItems", idx)} className="px-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100">✖</button>
                                                </div>
                                            ))}
                                            <button onClick={() => addArrayStringItem("clientsData", "lookingForItems", "New Item")} className="w-full py-2 bg-blue-50 text-brand-blue rounded-xl text-xs font-bold hover:bg-blue-100">{labels.addLookForItem || "+ Add Look For Item"}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Association Logos */}
                            <div className="mt-8 space-y-6 md:col-span-2">
                                <h4 className="flex items-center justify-between text-sm font-bold text-gray-900 border-l-4 border-brand-blue pl-3 uppercase tracking-widest">
                                    {labels.associationLogo || "Association Logos"}
                                    <button
                                        onClick={() => addArrayItem("clientsData", { name: "", image: "" }, "associations")}
                                        className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all"
                                    >
                                        {labels.addAssocLogo || "+ เพิ่มสมาคม/ชมรม"}
                                    </button>
                                </h4>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-gray-50 p-6 rounded-[2rem]">
                                    {content.clientsData?.associations?.map((assoc: any, idx: number) => (
                                        <div key={idx} className="relative group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow">
                                            <button
                                                onClick={() => removeArrayItem("clientsData", idx, "associations")}
                                                className="absolute -top-2 -right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                title="Remove Association"
                                            >
                                                ✖
                                            </button>

                                            <div className="relative w-full h-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-dashed border-gray-200 group-hover:border-brand-blue transition-colors">
                                                {assoc.image ? (
                                                    <Image src={assoc.image.startsWith('http') ? assoc.image : `/images/${assoc.image}`} alt={assoc.name || "Association"} fill className="object-contain p-2" unoptimized />
                                                ) : (
                                                    <div className="text-gray-400 text-[10px] font-semibold flex flex-col items-center">
                                                        <span>{labels.uploadLogo || "Upload Logo"}</span>
                                                    </div>
                                                )}
                                                <input type="file" onChange={(e) => handleContentImageUpload("clientsData", "associations", idx, "image", e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                            <input
                                                type="text"
                                                value={assoc.name || ""}
                                                onChange={(e) => handleArrayItemChange("clientsData", idx, "name", e.target.value, "associations")}
                                                className="w-full text-center border-none bg-transparent text-xs font-semibold p-1 focus:ring-0 text-gray-700"
                                                placeholder={labels.assocName || "Association Name"}
                                            />
                                        </div>
                                    ))}
                                    {(!content.clientsData?.associations || content.clientsData.associations.length === 0) && (
                                        <div className="col-span-full py-8 text-center text-sm font-semibold text-gray-400">
                                            {lang === 'en' ? 'No association logos yet. Click "+ Add Association" above to add.' : 'ยังไม่มีโลโก้สมาคม/ชมรม กดปุ่ม "+ เพิ่มสมาคม/ชมรม" ด้านบนเพื่อเพิ่ม'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
