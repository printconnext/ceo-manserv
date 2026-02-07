"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";


interface HeaderProps {
    data: {
        about: string;
        services: string;
        keyCustomers: string;
        lookingFor: string;
        contact: string;
        language: string;
        langLink: string;
    }
}

export default function Header({ data }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: data.about, href: "#about" },
        { name: data.services, href: "#services" },
        { name: data.keyCustomers, href: "#key-customers" },
        { name: data.lookingFor, href: "#looking-for" },
        { name: data.contact, href: "#contact" },
    ];

    return (
        <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200/20 dark:border-gray-800/20">
            <nav className="container-custom flex items-center justify-between p-4 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1 items-center gap-2">
                    {/* Logo Placeholder - Text based for now */}
                    {/* Logo - Image based */}
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Man Serv</span>
                        <Image
                            src="/ceo-manserv/images/manserv-logo.png"
                            alt="Man Serv Logo"
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
                    <Link href={data.langLink} className="text-sm font-bold leading-6 text-brand-blue dark:text-brand-blue border border-brand-blue/30 px-3 py-1 rounded-full hover:bg-brand-blue hover:text-white transition-all">
                        {data.language}
                    </Link>
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
                        <Link
                            href={data.langLink}
                            className="block py-2 text-base font-bold text-brand-blue"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {data.language}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

