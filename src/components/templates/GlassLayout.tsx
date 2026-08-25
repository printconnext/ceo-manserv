"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { ProfileLayoutProps } from "./ClassicLayout";

export default function GlassLayout(props: ProfileLayoutProps) {
    const {
        themeConfig, resolvedLang, layoutConfig,
        headerData, heroData, aboutDataFormatted,
        servicesDataFormatted, experienceDataFormatted,
        clientsDataFormatted, contactDataFormatted, footerDataFormatted
    } = props;

    // Override colors so ThemeProvider uses transparent bg + white text
    const glassTheme = {
        ...themeConfig,
        colors: {
            ...(themeConfig.colors || {}),
            background: 'transparent',
            text: '#ffffff',
        }
    };

    return (
        <ThemeProvider themeConfig={glassTheme} className={`flex flex-col min-h-screen lang-${resolvedLang}`}>
            {/* Glass background gradient — dynamically using primary color */}
            <div 
                className="fixed inset-0 -z-10"
                style={{
                    background: 'linear-gradient(to bottom right, #0f172a, var(--color-primary), #020617)',
                    opacity: 0.9
                }}
            >
                {/* Floating orbs for depth using CSS color-mix to blend with primary color */}
                <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full blur-[120px] animate-pulse" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 60%, transparent)' }}></div>
                <div className="absolute top-[50%] right-[10%] w-[350px] h-[350px] rounded-full blur-[120px]" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 40%, #0f172a)' }}></div>
                <div className="absolute bottom-[10%] left-[40%] w-[300px] h-[300px] rounded-full blur-[120px]" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 50%, #ffffff 20%)' }}></div>
            </div>

            {/* Override Header for glass */}
            <style>{`
                header { background: rgba(255,255,255,0.08) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important; border-color: rgba(255,255,255,0.1) !important; }
                header a, header button, header div { color: #fff !important; }
                header a:hover { color: rgba(255,255,255,0.7) !important; }
                
                /* Utilities for dynamic text color based on primary */
                .text-glass-accent { color: color-mix(in srgb, var(--color-primary) 40%, white); }
                .bg-glass-accent-light { background-color: color-mix(in srgb, var(--color-primary) 30%, transparent); }
                .border-glass-accent { border-color: color-mix(in srgb, var(--color-primary) 50%, transparent); }
            `}</style>
            <Header data={headerData} />

            <main className="flex-grow text-white">

                {/* ===== GLASS HERO ===== */}
                {layoutConfig.showHero && (
                    <section id="hero" className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
                        <div className="container-custom mx-auto relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                <div className="lg:col-span-7 text-center lg:text-left">
                                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl">
                                        {heroData.name}
                                    </h1>
                                    <h2 className="text-2xl font-light text-glass-accent mb-8">{heroData.title}</h2>
                                    <blockquote className="border-l-4 border-glass-accent pl-6 italic text-xl text-white/70 mb-10 max-w-2xl mx-auto lg:mx-0">
                                        {heroData.quote}
                                    </blockquote>
                                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                        <Link href="#contact" className="w-full sm:w-auto rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 px-8 py-3.5 text-base font-bold text-white hover:bg-white/30 transition-all hover:-translate-y-0.5 shadow-lg text-center">
                                            {heroData.contactButton}
                                        </Link>
                                        <Link href="#about" className="text-base font-semibold text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                            {heroData.standardButton} <span>→</span>
                                        </Link>
                                    </div>
                                    {/* Trust badges */}
                                    <div className="flex items-center justify-center lg:justify-start gap-6 mt-10">
                                        {heroData.badges.slice(0, 2).map((badge: any, idx: number) => (
                                            <Image key={idx} src={badge.src} alt={badge.alt} width={0} height={0} sizes="100vw" className="w-auto h-[60px] object-contain" unoptimized />
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                                    <div className="relative w-[300px] h-[420px] sm:w-[350px] sm:h-[480px]">
                                        {/* Glass frame */}
                                        <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 translate-x-4 translate-y-4"></div>
                                        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/10 to-transparent ring-1 ring-white/20">
                                            <Image src={heroData.heroImage} alt={heroData.name} fill className="object-cover" priority unoptimized />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-6 left-6">
                                                <p className="text-white text-lg font-bold">{heroData.name}</p>
                                                <p className="text-glass-accent text-xs font-medium mt-1">{heroData.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gallery */}
                            {heroData.heroGallery && heroData.heroGallery.length > 0 && (
                                <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {heroData.heroGallery.slice(0, 4).map((img: string, idx: number) => (
                                        <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl group bg-white/10 backdrop-blur-sm border border-white/10">
                                            <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ===== GLASS ABOUT ===== */}
                {layoutConfig.showAbout && (
                    <section id="about" className="py-24">
                        <div className="container-custom">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-xl">
                                    <span className="text-xs font-bold text-glass-accent uppercase tracking-widest">{aboutDataFormatted.visionMission}</span>
                                    <h3 className="mt-3 text-3xl font-bold text-white" dangerouslySetInnerHTML={{ __html: aboutDataFormatted.visionTitle }}></h3>
                                    <div className="mt-6 space-y-4 text-white/70 leading-relaxed">
                                        <p>{aboutDataFormatted.visionDesc1}</p>
                                        <p>{aboutDataFormatted.visionDesc2}</p>
                                    </div>
                                </div>
                                {aboutDataFormatted.showStats && aboutDataFormatted.stats && aboutDataFormatted.stats.length > 0 && (
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-xl flex flex-col justify-center">
                                        <div className="grid grid-cols-2 gap-8">
                                            {aboutDataFormatted.stats.map((stat: any) => (
                                                <div key={stat.label} className="text-center">
                                                    <div className="text-4xl font-black text-white">{stat.value}</div>
                                                    <div className="text-xs text-white/50 mt-2 uppercase tracking-wider">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {aboutDataFormatted.trustText && (
                                            <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/40">{aboutDataFormatted.trustText}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== GLASS SERVICES ===== */}
                {layoutConfig.showServices && (
                    <section id="services" className="py-24">
                        <div className="container-custom">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-white">{servicesDataFormatted.title}</h2>
                                <p className="mt-3 text-white/50">{servicesDataFormatted.subtitle}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {servicesDataFormatted.items.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden group hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                        {item.image && (
                                            <div className="relative h-44 w-full">
                                                <Image src={item.image?.startsWith('http') ? item.image : `/images/${item.image || 'service-1.png'}`} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== GLASS EXPERIENCE ===== */}
                {layoutConfig.showExperience && experienceDataFormatted.items && experienceDataFormatted.items.length > 0 && (
                    <section id="experience" className="py-24">
                        <div className="container-custom max-w-4xl">
                            <h2 className="text-3xl font-bold text-white text-center mb-16">{experienceDataFormatted.title}</h2>
                            <div className="space-y-6">
                                {experienceDataFormatted.items.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all shadow-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="px-3 py-1 rounded-full bg-glass-accent-light text-glass-accent text-xs font-bold border border-glass-accent">{item.period}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{item.role}</h3>
                                        <p className="text-sm text-glass-accent mt-1">{item.company}</p>
                                        <p className="text-white/60 mt-3 leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== GLASS CLIENTS ===== */}
                {layoutConfig.showClients && (
                    <section className="py-24">
                        <div className="container-custom">
                            <div id="key-customers" className="scroll-mt-24 text-center mb-16">
                                <span className="inline-block rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-semibold text-white mb-6">{clientsDataFormatted.keyCustomersBadge}</span>
                                <h2 className="text-3xl font-bold text-white mb-10">{clientsDataFormatted.keyCustomersTitle}</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-items-center">
                                    {clientsDataFormatted.items?.map((item: any, idx: number) => {
                                        const name = typeof item === 'string' ? item : item.name;
                                        const imagePath = (typeof item === 'object' && item.image)
                                            ? (item.image.startsWith('http') ? item.image : `/images/customers/${item.image}`)
                                            : `/images/customers/${name?.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}.png`;
                                        return (
                                            <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-center w-full hover:bg-white/15 transition-all">
                                                <div className="relative w-[80px] h-[40px]">
                                                    <Image src={imagePath} alt={name || "Client"} fill className="object-contain contrast-[1.2] saturate-[1.2]" unoptimized />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {clientsDataFormatted.lookingForItems && clientsDataFormatted.lookingForItems.length > 0 && (
                                <div id="looking-for" className="scroll-mt-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-xl">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="flex flex-col h-full">
                                            <div>
                                                <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white mb-4">{clientsDataFormatted.lookingForBadge}</span>
                                                <h3 className="text-2xl font-bold text-white mb-4">{clientsDataFormatted.lookingForTitle}</h3>
                                                <p className="text-white/60">{clientsDataFormatted.lookingForDesc}</p>
                                            </div>
                                            
                                            {clientsDataFormatted.associations && clientsDataFormatted.associations.length > 0 && (
                                                <div className="mt-auto pt-10 flex flex-wrap gap-4">
                                                    {clientsDataFormatted.associations.map((assoc: any, idx: number) => (
                                                        <div key={idx} className="relative h-20 w-48 opacity-80 hover:opacity-100 transition-opacity">
                                                            <Image
                                                                src={assoc.image ? (assoc.image.startsWith('http') ? assoc.image : `/images/${assoc.image}`) : "/images/bni-logo.png"}
                                                                alt={assoc.name || "Association"}
                                                                fill
                                                                className="object-contain object-left"
                                                                unoptimized
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <ul className="grid grid-cols-1 gap-3">
                                                {clientsDataFormatted.lookingForItems.map((item: string, idx: number) => (
                                                    <li key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 text-white hover:bg-white/10 transition-colors flex gap-3 items-center">
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-glass-accent-light text-glass-accent text-xs font-bold">{idx + 1}</span>
                                                        <span className="text-white/80">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                        </div>
                    </section>
                )}

                {/* ===== GLASS CONTACT ===== */}
                {layoutConfig.showContact && (
                    <section id="contact" className="py-24">
                        <div className="container-custom max-w-3xl">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-xl text-center">
                                <h2 className="text-3xl font-bold text-white mb-3">{contactDataFormatted.title}</h2>
                                <p className="text-white/50 mb-10">{contactDataFormatted.subtitle}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    {[
                                        { label: contactDataFormatted.officeLabel, value: contactDataFormatted.officeValue },
                                        { label: contactDataFormatted.officePhoneLabel, value: contactDataFormatted.officePhoneValue, href: contactDataFormatted.officePhoneValue ? `tel:${contactDataFormatted.officePhoneValue.replace(/[^0-9+]/g, '')}` : null },
                                        { label: contactDataFormatted.mobileLabel, value: contactDataFormatted.mobileValue, href: contactDataFormatted.mobileValue ? `tel:${contactDataFormatted.mobileValue.replace(/[^0-9+]/g, '')}` : null },
                                        { label: contactDataFormatted.emailLabel, value: contactDataFormatted.emailValue, href: contactDataFormatted.emailValue ? `mailto:${contactDataFormatted.emailValue}` : null },
                                        ...(contactDataFormatted.websites || []).map((w: string) => ({ label: contactDataFormatted.websiteLabel, value: w, href: w ? (w.startsWith('http') ? w : `https://${w}`) : null })),
                                    ].filter(c => c.value).map((c, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                                            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{c.label}</p>
                                            {c.href ? (
                                                <a href={c.href} className="text-glass-accent hover:text-white transition-colors font-medium">{c.value}</a>
                                            ) : (
                                                <p className="text-white/80 font-medium">{c.value}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {contactDataFormatted.lineValue && (
                                    <div className="mt-8 flex justify-center">
                                        <a href={contactDataFormatted.lineValue.startsWith('http') ? contactDataFormatted.lineValue : `https://line.me/ti/p/~${contactDataFormatted.lineValue.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors inline-flex flex-col items-center">
                                            <QRCodeSVG value={contactDataFormatted.lineValue.startsWith('http') ? contactDataFormatted.lineValue : `https://line.me/ti/p/~${contactDataFormatted.lineValue.replace('@', '')}`} size={120} level="H" fgColor="#ffffff" bgColor="transparent" />
                                            <span className="mt-3 text-xs text-glass-accent font-bold">{contactDataFormatted.clickToAdd || 'LINE'}</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

            </main>
            <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 py-8">
                <div className="container-custom text-center text-sm text-white/30">
                    © {new Date().getFullYear()} {footerDataFormatted.rights}
                </div>
            </footer>
        </ThemeProvider>
    );
}
