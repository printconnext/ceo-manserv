"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LANG_NAMES } from "@/data/locales";

interface ProfileData {
    orgName: string;
    orgSlug: string;
    profileSlug: string;
    fullName: string;
    title: string;
    phone1: string;
    phone2: string;
    email: string;
    website: string;
    lineUrl: string;

    id?: string;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function mapResponseToForm(data: any): ProfileData | null {
    if (!data?.organization) return null;
    const org = data.organization;
    const profile = org.profiles?.[0];
    return {
        orgName: org.name || "",
        orgSlug: org.slug || "",
        profileSlug: profile?.slug || "",
        fullName: profile?.fullName || "",
        title: profile?.title || "",
        phone1: profile?.phone1 || "",
        phone2: profile?.phone2 || "",
        email: profile?.email || "",
        website: profile?.website || "",
        lineUrl: profile?.lineUrl || "",

        id: profile?.id,
    };
}

export const emptyForm: ProfileData = {
    orgName: "",
    orgSlug: "",
    profileSlug: "",
    fullName: "",
    title: "",
    phone1: "",
    phone2: "",
    email: "",
    website: "",
    lineUrl: "",

    id: "",
};

export default function ProfileForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<ProfileData>(emptyForm);
    const [profileUrl, setProfileUrl] = useState("");
    const [uiLang, setUiLang] = useState("th");

    // Initialize uiLang from URL if present
    useEffect(() => {
        const searchParams = new URL(window.location.href).searchParams;
        const lang = searchParams.get("lang");
        if (lang && LOCALES[lang]) {
            setUiLang(lang);
        }
    }, []);
    const [availableLangs, setAvailableLangs] = useState(["th"]);

    const labels = { ...LOCALES.en.editor, ...LOCALES[uiLang]?.editor };

    // Fetch saved profile data from API on mount
    const loadProfile = useCallback(async () => {
        setLoading(true);
        try {
            const searchParams = new URL(window.location.href).searchParams;
            const profileId = searchParams.get("id");
            const url = profileId ? `/api/profile?id=${profileId}` : "/api/profile";

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();

                if (data.availableLangs) {
                    setAvailableLangs(data.availableLangs);
                }

                // If editing specific profile
                if (profileId && data.organization?.profiles) {
                    const specific = data.organization.profiles.find((p: any) => p.id === profileId);
                    if (specific) {
                        const mapped = mapResponseToForm({ organization: { ...data.organization, profiles: [specific] } });
                        if (mapped) {
                            setForm(mapped);
                            setProfileUrl(`/${mapped.orgSlug}/${mapped.profileSlug}`);

                            // SYNC LANGUAGE: Set the UI language based on the profile's translation
                            const profileLang = specific.translations?.[0]?.lang;
                            if (profileLang) {
                                setUiLang(profileLang);
                            }

                            setLoading(false);
                            return;
                        }
                    }
                }

                // If creating NEW profile but organization exists (Pre-filling)
                if (!profileId && data.organization) {
                    const org = data.organization;

                    setForm({
                        ...emptyForm,
                        orgName: org.name || "",
                        orgSlug: org.slug || "",
                    });
                } else if (!profileId) {
                    setForm(emptyForm);
                } else {
                    const mapped = mapResponseToForm(data);
                    if (mapped) {
                        setForm(mapped);
                        if (mapped.orgSlug && mapped.profileSlug) {
                            setProfileUrl(`/${mapped.orgSlug}/${mapped.profileSlug}`);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Failed to fetch profile from API:", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setSaved(false);
    };

    const handleOrgNameBlur = () => {
        if (form.orgName && !form.orgSlug) {
            setForm((prev) => ({ ...prev, orgSlug: slugify(prev.orgName) }));
        }
    };

    const handleFullNameBlur = () => {
        if (form.fullName && !form.profileSlug) {
            setForm((prev) => ({ ...prev, profileSlug: slugify(prev.fullName) }));
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSaved(false);

        try {
            const res = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    uiLang,
                    id: form.id || undefined
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save profile");
            }

            if (data.profileUrl) {
                setProfileUrl(data.profileUrl);
            }

            await loadProfile();
            setSaved(true);

            // Redirect to overview after successful save
            // Especially useful for new profiles as requested
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);

            setTimeout(() => setSaved(false), 5000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const getPreviewUrl = () => {
        if (!form.orgSlug || !form.fullName) return "";
        let slug = form.profileSlug || slugify(form.fullName);
        slug = slug.replace(/-(TH|EN|CH|JP)$/i, "");
        const langSuffix = `-${uiLang.toUpperCase()}`;
        if (!slug.endsWith(langSuffix)) {
            slug = `${slug}${langSuffix}`;
        }
        return `/${form.orgSlug}/${slug}`;
    };

    const previewUrl = getPreviewUrl();

    if (loading) {
        return (
            <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" >
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-48 bg-gray-100 rounded animate-pulse mt-2"></div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map((j) => (
                                <div key={j}>
                                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="mb-2 px-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{labels.profileSettingTitle || "Profile Setting"}</h1>
                <p className="text-gray-600">{labels.profileSettingDesc || "Manage your basic profile information"}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Multi-language Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-widest">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            {labels.official}
                        </span>
                    </div>

                    <div className="relative min-w-[200px]">
                        <select
                            value={uiLang}
                            onChange={(e) => setUiLang(e.target.value)}
                            className="w-full bg-white pl-4 pr-10 py-2 rounded-xl border border-gray-200 shadow-sm text-xs font-bold text-gray-700 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none appearance-none transition-all cursor-pointer"
                        >
                            {availableLangs.map(lang => (
                                <option key={lang} value={lang}>
                                    {LANG_NAMES[lang]}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-base font-bold text-gray-900">{labels.personalTitle}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{labels.personalDesc}</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.fullName}</label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                onBlur={handleFullNameBlur}
                                placeholder={labels.fullNamePlace}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.title}</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder={labels.titlePlace}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.email}</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder={labels.emailPlace}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.website}</label>
                            <input
                                type="url"
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                placeholder={labels.websitePlace}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-base font-bold text-gray-900">{labels.contactTitle}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{labels.contactDesc}</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.phone1}</label>
                            <input
                                type="tel"
                                name="phone1"
                                value={form.phone1}
                                onChange={handleChange}
                                placeholder="0812345678"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.phone2}</label>
                            <input
                                type="tel"
                                name="phone2"
                                value={form.phone2}
                                onChange={handleChange}
                                placeholder="0898765432"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.line}</label>
                            <input
                                type="url"
                                name="lineUrl"
                                value={form.lineUrl}
                                onChange={handleChange}
                                placeholder="https://line.me/ti/p/..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Organization & URL */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-base font-bold text-gray-900">{labels.orgTitle}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{labels.orgDesc}</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.orgName}</label>
                                <input
                                    type="text"
                                    name="orgName"
                                    value={form.orgName}
                                    onChange={handleChange}
                                    onBlur={handleOrgNameBlur}
                                    placeholder={labels.orgNamePlace}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.orgSlug}</label>
                                <input
                                    type="text"
                                    name="orgSlug"
                                    value={form.orgSlug}
                                    onChange={handleChange}
                                    placeholder="e.g., abc-company"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Profile Slug */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.profileSlug}</label>
                            <input
                                type="text"
                                name="profileSlug"
                                value={form.profileSlug}
                                onChange={handleChange}
                                placeholder="e.g., john-d"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                            />
                        </div>

                        {/* URL Preview */}
                        {previewUrl && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <p className="text-xs font-medium text-blue-600 mb-1">{labels.urlPreview}</p>
                                <p className="text-sm font-mono text-blue-900">
                                    ceoprofile.site<span className="font-bold">{previewUrl}</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>



                {/* Save Button & Status */}
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-brand-blue px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {saving ? labels.saving : labels.save}
                    </button>

                    {saved && (
                        <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-fade-in">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            {labels.success}
                        </span>
                    )}

                    {error && (
                        <span className="text-sm text-red-500 font-medium">{error}</span>
                    )}
                </div>

                {/* Preview Link after save */}
                {saved && profileUrl && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                        <h4 className="text-sm font-bold text-green-800 mb-2">{labels.ready}</h4>
                        <p className="text-sm text-green-700 mb-3">{labels.viewProfile}:</p>
                        <a
                            href={profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            {labels.viewProfile}
                        </a>
                    </div>
                )}
            </form>
        </div>
    );
}
