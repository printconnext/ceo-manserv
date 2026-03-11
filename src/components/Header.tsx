"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface HeaderProps {
    data: {
        about: string;
        services: string;
        keyCustomers: string;
        lookingFor: string;
        contact: string;
        language: string;
        langLink: string;
        logo: string;
        companyName: string;
        plan?: string;
        orgSlug?: string;
        profileSlug?: string;
        availableLanguages?: Array<{ code: string, langCode: string, slug: string, isCurrent: boolean }>;
    }
}

export default function Header({ data }: HeaderProps) {
    const { orgSlug, availableLanguages = [] } = data;

    const allLanguagesData = [
        { code: 'TH', label: '🇹🇭 ไทย' },
        { code: 'EN', label: '🇬🇧 English' },
        { code: 'CH', label: '🇨🇳 中文' },
        { code: 'JP', label: '🇯🇵 日本語' },
        { code: 'HI', label: '🇮🇳 Hindi' },
        { code: 'FR', label: '🇫🇷 Français' },
        { code: 'IT', label: '🇮🇹 Italiano' },
        { code: 'ES', label: '🇪🇸 Español' },
        { code: 'DE', label: '🇩🇪 Deutsch' },
        { code: 'RU', label: '🇷🇺 Русский' },
        { code: 'FA', label: '🇮🇷 فارسی' },
        { code: 'PT', label: '🇵🇹 Português' },
        { code: 'BR', label: '🇧🇷 Brasil' },
        { code: 'VI', label: '🇻🇳 Tiếng Việt' },
        { code: 'LO', label: '🇱🇦 ລາວ' },
        { code: 'MY', label: '🇲🇲 ဗမာ' },
        { code: 'PH', label: '🇵🇭 Filipino' },
        { code: 'ID', label: '🇮🇩 Indonesia' },
    ];


    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setLangMenuOpen(false);
            }
        }
        if (langMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [langMenuOpen]);

    const navigation = [
        { name: data.about, href: "#about" },
        { name: data.services, href: "#services" },
        { name: data.keyCustomers, href: "#key-customers" },
        { name: data.lookingFor, href: "#looking-for" },
        { name: data.contact, href: "#contact" },
    ];

    const currentLang = data.language;
    const hasSiblings = availableLanguages.length > 1;

    return (
        <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200/20 dark:border-gray-800/20">
            <nav className="container-custom flex items-center justify-between p-4 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1 items-center gap-2">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">{data.companyName}</span>
                        <Image
                            src={data.logo}
                            alt={`${data.companyName} Logo`}
                            width={200}
                            height={60}
                            className="h-14 w-auto object-contain"
                            priority
                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        {mobileMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12 items-center">
                    {navigation.map((item) => (
                        <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {item.name}
                        </Link>
                    ))}

                    {/* Language Dropdown (Only show if siblings exist) */}
                    {hasSiblings ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className="text-sm font-bold leading-6 text-[var(--color-primary)] dark:text-[var(--color-primary)] border border-[var(--color-primary)]/30 px-3 py-1 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center gap-1"
                            >
                                🌐 {currentLang}
                                <svg className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {langMenuOpen && (
                                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                                    {availableLanguages.map((lang) => {
                                        const label = allLanguagesData.find(l => l.code === lang.code)?.label || lang.code;
                                        if (lang.isCurrent) {
                                            return (
                                                <div key={lang.code} className="px-4 py-2.5 text-sm font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20">
                                                    {label}
                                                </div>
                                            );
                                        }
                                        return (
                                            <Link
                                                key={lang.code}
                                                href={`/${orgSlug}/${lang.slug}/${lang.langCode}`}
                                                className="block px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-[var(--color-primary)] hover:text-white transition-colors flex items-center justify-between"
                                                onClick={() => setLangMenuOpen(false)}
                                            >
                                                <span>{label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm font-bold leading-6 text-gray-400 border border-gray-100 px-3 py-1 rounded-full flex items-center gap-1 opacity-60">
                            🌐 {currentLang}
                        </div>
                    )}
                </div>
            </nav>
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 shadow-xl">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {hasSiblings && (
                            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">🌐 Language</p>
                                <div className="flex flex-wrap gap-2">
                                    {availableLanguages.map((lang) => {
                                        const label = allLanguagesData.find(l => l.code === lang.code)?.label || lang.code;
                                        if (lang.isCurrent) {
                                            return (
                                                <span key={lang.code} className="px-3 py-1.5 text-sm font-bold text-white bg-[var(--color-primary)] rounded-full">
                                                    {label}
                                                </span>
                                            );
                                        }
                                        return (
                                            <Link
                                                key={lang.code}
                                                href={`/${orgSlug}/${lang.slug}/${lang.langCode}`}
                                                className="px-3 py-1.5 text-sm font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/30 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
