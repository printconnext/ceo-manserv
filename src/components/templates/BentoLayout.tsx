"use client";

import React from "react";
import Header from "@/components/Header";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import Link from "next/link";
import Image from "next/image";
import { ProfileLayoutProps } from "./ClassicLayout";

export default function BentoLayout(props: ProfileLayoutProps) {
    const {
        themeConfig, resolvedLang, layoutConfig,
        headerData, heroData, aboutDataFormatted,
        servicesDataFormatted, experienceDataFormatted,
        clientsDataFormatted, contactDataFormatted, footerDataFormatted
    } = props;

    return (
        <ThemeProvider themeConfig={themeConfig} className={`flex flex-col min-h-screen lang-${resolvedLang} bg-gray-100`}>
            <Header data={headerData} />
            <main className="flex-grow pt-24">

                {/* ===== BENTO HERO ===== */}
                {layoutConfig.showHero && (
                    <section id="hero" className="container-custom py-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-[minmax(180px,1fr)]">
                            {/* Main hero card — spans 2 cols, 2 rows */}
                            <div
                                className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden shadow-xl group"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    ...(heroData.media.backgroundPattern ? {
                                        backgroundImage: `url(${heroData.media.backgroundPattern})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    } : {})
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                                <Image src={heroData.heroImage} alt={heroData.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority unoptimized />
                                <div className="absolute bottom-0 left-0 p-8 z-20">
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{heroData.name}</h1>
                                    <h2 className="text-lg text-white/80 font-medium">{heroData.title}</h2>
                                </div>
                            </div>

                            {/* Quote card */}
                            <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm flex flex-col justify-center border border-gray-200/60">
                                <blockquote className="text-xl md:text-2xl font-light text-gray-700 italic leading-relaxed border-l-4 border-[var(--color-accent)] pl-6">
                                    "{heroData.quote}"
                                </blockquote>
                                <p className="mt-4 text-sm text-gray-400 font-semibold">— {heroData.name}</p>
                            </div>

                            {/* CTA card */}
                            <div className="bg-[var(--color-primary)] rounded-3xl p-6 flex flex-col items-center justify-center text-white shadow-sm">
                                <Link href="#contact" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--color-primary)] hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5 w-full text-center">
                                    {heroData.contactButton}
                                </Link>
                                <Link href="#about" className="mt-3 text-sm font-medium text-white/70 hover:text-white transition-colors">
                                    {heroData.standardButton} →
                                </Link>
                            </div>

                            {/* Badges card */}
                            <div className="bg-white rounded-3xl p-6 flex items-center justify-center gap-6 shadow-sm border border-gray-200/60">
                                {heroData.badges.slice(0, 2).map((badge: any, idx: number) => (
                                    <Image key={idx} src={badge.src} alt={badge.alt} width={0} height={0} sizes="100vw" className="w-auto h-[50px] object-contain" unoptimized />
                                ))}
                            </div>
                        </div>

                        {/* Gallery bento row */}
                        {heroData.heroGallery && heroData.heroGallery.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {heroData.heroGallery.slice(0, 4).map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group border border-gray-200/60">
                                        <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* ===== BENTO ABOUT ===== */}
                {layoutConfig.showAbout && (
                    <section id="about" className="container-custom py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 bg-white rounded-3xl p-10 shadow-sm border border-gray-200/60">
                                <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">{aboutDataFormatted.visionMission}</span>
                                <h3 className="mt-2 text-2xl font-bold text-gray-900" dangerouslySetInnerHTML={{ __html: aboutDataFormatted.visionTitle }}></h3>
                                <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
                                    <p>{aboutDataFormatted.visionDesc1}</p>
                                    <p>{aboutDataFormatted.visionDesc2}</p>
                                </div>
                            </div>
                            {aboutDataFormatted.showStats && aboutDataFormatted.stats && aboutDataFormatted.stats.length > 0 && (
                                <div className="bg-[var(--color-primary)] rounded-3xl p-8 text-white shadow-sm flex flex-col justify-center">
                                    <div className="grid grid-cols-2 gap-6">
                                        {aboutDataFormatted.stats.map((stat: any) => (
                                            <div key={stat.label}>
                                                <div className="text-3xl font-black">{stat.value}</div>
                                                <div className="text-xs text-white/70 mt-1">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ===== BENTO SERVICES ===== */}
                {layoutConfig.showServices && (
                    <section id="services" className="container-custom py-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">{servicesDataFormatted.title}</h2>
                            <p className="mt-2 text-gray-500">{servicesDataFormatted.subtitle}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {servicesDataFormatted.items.map((item: any, idx: number) => (
                                <div key={idx} className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200/60 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${idx === 0 ? 'md:col-span-2 md:row-span-1' : ''}`}>
                                    {item.image && (
                                        <div className={`relative w-full bg-gray-100 ${idx === 0 ? 'h-64 sm:h-80' : 'h-48'}`}>
                                            <Image src={item.image?.startsWith('http') ? item.image : `/images/${item.image || 'service-1.png'}`} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ===== BENTO EXPERIENCE ===== */}
                {layoutConfig.showExperience && experienceDataFormatted.items && experienceDataFormatted.items.length > 0 && (
                    <section id="experience" className="container-custom py-8">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{experienceDataFormatted.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {experienceDataFormatted.items.map((item: any, idx: number) => (
                                <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/60 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold">{item.period}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{item.role}</h3>
                                    <p className="text-sm font-medium text-[var(--color-primary)] mt-1">{item.company}</p>
                                    <p className="text-sm text-gray-500 mt-3 leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ===== BENTO CLIENTS ===== */}
                {layoutConfig.showClients && <Clients data={clientsDataFormatted} />}

                {/* ===== BENTO CONTACT ===== */}
                {layoutConfig.showContact && <Contact data={contactDataFormatted} />}

            </main>
            <Footer data={footerDataFormatted} />
        </ThemeProvider>
    );
}
