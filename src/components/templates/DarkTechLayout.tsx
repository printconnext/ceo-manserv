"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { ProfileLayoutProps } from "./ClassicLayout";

export default function DarkTechLayout(props: ProfileLayoutProps) {
    const {
        themeConfig, resolvedLang, layoutConfig,
        headerData, heroData, aboutDataFormatted,
        servicesDataFormatted, experienceDataFormatted,
        clientsDataFormatted, contactDataFormatted, footerDataFormatted
    } = props;

    // Neon accent color from theme or fallback
    const neon = themeConfig.colors?.accent || "#00ff88";
    const primaryColor = themeConfig.colors?.primary || "#0F766E";

    return (
        <ThemeProvider themeConfig={{...themeConfig, colors: {...themeConfig.colors, background: '#0a0a0f', text: '#e0e0e0'}}} className={`flex flex-col min-h-screen lang-${resolvedLang}`}>
            {/* Override Header styles for dark */}
            <style>{`
                header { background: rgba(10,10,15,0.85) !important; border-color: rgba(255,255,255,0.05) !important; }
                header a, header button, header div { color: #e0e0e0 !important; }
                header a:hover { color: ${neon} !important; }
            `}</style>
            <Header data={headerData} />
            <main className="flex-grow bg-[#0a0a0f] text-gray-200">

                {/* ===== DARK HERO ===== */}
                {layoutConfig.showHero && (
                    <section id="hero" className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-[#0a0a0f]">
                        {/* Animated grid background */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                        {/* Glow orbs */}
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20" style={{ backgroundColor: neon }}></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-15" style={{ backgroundColor: primaryColor }}></div>

                        <div className="container-custom mx-auto relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                <div className="lg:col-span-7 text-center lg:text-left">
                                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                                        <div className="inline-flex items-center space-x-2 rounded-none px-5 py-2 text-xs font-mono font-bold uppercase tracking-[0.3em] border" style={{ borderColor: neon, color: neon }}>
                                            {heroData.badge}
                                        </div>
                                    </div>
                                    <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white mb-4 leading-[1.05]">
                                        {heroData.name}
                                    </h1>
                                    <h2 className="text-xl lg:text-2xl font-light mb-8" style={{ color: neon }}>{heroData.title}</h2>
                                    <blockquote className="text-lg text-gray-400 font-light mb-10 max-w-2xl mx-auto lg:mx-0 pl-6" style={{ borderLeft: `2px solid ${neon}` }}>
                                        {heroData.quote}
                                    </blockquote>
                                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mt-4">
                                        <Link href="#contact" className="rounded-none px-8 py-3.5 text-sm font-mono font-bold uppercase tracking-wider text-black hover:brightness-110 transition-all" style={{ backgroundColor: neon }}>
                                            {heroData.contactButton}
                                        </Link>
                                        
                                        <div className="flex items-center gap-6">
                                            <Link href="#about" className="text-sm font-mono text-gray-400 hover:text-white transition-colors tracking-wider uppercase flex items-center gap-2">
                                                {heroData.standardButton} <span>→</span>
                                            </Link>
                                            
                                            {/* Trust badges inline */}
                                            {heroData.badges && heroData.badges.length > 0 && (
                                                <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                                                    {heroData.badges.slice(0, 2).map((badge: any, idx: number) => (
                                                        <Image key={idx} src={badge.src} alt={badge.alt} width={0} height={0} sizes="100vw" className="w-auto h-[72px] object-contain" unoptimized />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                                    <div className="relative w-[300px] h-[420px] sm:w-[350px] sm:h-[480px]">
                                        {/* Neon border frame */}
                                        <div className="absolute inset-0 translate-x-3 translate-y-3" style={{ border: `1px solid ${neon}`, opacity: 0.3 }}></div>
                                        <div className="absolute inset-0 overflow-hidden bg-gray-900 ring-1 ring-white/10">
                                            <Image src={heroData.heroImage} alt={heroData.name} fill className="object-cover" priority unoptimized />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 left-4">
                                                <p className="text-white text-sm font-mono">{heroData.name}</p>
                                                <p className="text-xs font-mono" style={{ color: neon }}>{heroData.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== DARK ABOUT ===== */}
                {layoutConfig.showAbout && (
                    <section id="about" className="py-24 bg-[#0a0a0f]">
                        <div className="container-custom">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                <div>
                                    <p className="text-xs font-mono uppercase tracking-[0.3em] mb-4" style={{ color: neon }}>{aboutDataFormatted.visionMission}</p>
                                    <h3 className="text-3xl font-bold text-white mb-6" dangerouslySetInnerHTML={{ __html: aboutDataFormatted.visionTitle }}></h3>
                                    <div className="space-y-4 text-gray-400 leading-relaxed">
                                        <p>{aboutDataFormatted.visionDesc1}</p>
                                        <p>{aboutDataFormatted.visionDesc2}</p>
                                    </div>
                                </div>
                                {aboutDataFormatted.showStats && aboutDataFormatted.stats && aboutDataFormatted.stats.length > 0 && (
                                    <div className="grid grid-cols-2 gap-6">
                                        {aboutDataFormatted.stats.map((stat: any) => (
                                            <div key={stat.label} className="p-6 border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors">
                                                <div className="text-4xl font-black text-white">{stat.value}</div>
                                                <div className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wider">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== DARK SERVICES ===== */}
                {layoutConfig.showServices && (
                    <section id="services" className="py-24 bg-[#0d0d14]">
                        <div className="container-custom">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-white">{servicesDataFormatted.title}</h2>
                                <p className="mt-3 text-gray-500">{servicesDataFormatted.subtitle}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {servicesDataFormatted.items.map((item: any, idx: number) => (
                                    <div key={idx} className="p-6 border border-white/10 bg-white/[0.02] group hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/30 transition-all duration-500" style={{ '--tw-gradient-via': `${neon}33` } as any}></div>
                                        <span className="text-xs font-mono text-gray-600 mb-4 block">[{String(idx + 1).padStart(2, '0')}]</span>
                                        
                                        {item.image && (
                                            <div className="relative h-40 w-full mb-6 border border-white/5 overflow-hidden">
                                                <Image 
                                                    src={item.image?.startsWith('http') ? item.image : `/images/${item.image || 'service-1.png'}`} 
                                                    alt={item.title} 
                                                    fill 
                                                    className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                                                    unoptimized 
                                                />
                                                <div className="absolute inset-0 opacity-20 mix-blend-color" style={{ backgroundColor: neon }}></div>
                                            </div>
                                        )}
                                        
                                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-white transition-colors">{item.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed flex-grow">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== DARK EXPERIENCE ===== */}
                {layoutConfig.showExperience && experienceDataFormatted.items && experienceDataFormatted.items.length > 0 && (
                    <section id="experience" className="py-24 bg-[#0a0a0f]">
                        <div className="container-custom max-w-4xl">
                            <h2 className="text-3xl font-bold text-white text-center mb-16">{experienceDataFormatted.title}</h2>
                            <div className="space-y-8 relative border-l border-white/10 ml-3 pl-10">
                                {experienceDataFormatted.items.map((item: any, idx: number) => (
                                    <div key={idx} className="relative group">
                                        <span className="absolute -left-[43px] top-1 h-4 w-4 rounded-none border-2 bg-[#0a0a0f] group-hover:bg-current transition-colors" style={{ borderColor: neon }}></span>
                                        <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: neon }}>{item.period}</p>
                                        <h3 className="text-xl font-bold text-white">{item.role}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{item.company}</p>
                                        <p className="text-gray-400 mt-3 leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== DARK CLIENTS ===== */}
                {layoutConfig.showClients && (
                    <section className="py-24 bg-[#0d0d14]">
                        <div className="container-custom">
                            <div id="key-customers" className="mb-16 scroll-mt-24 text-center">
                                <p className="text-xs font-mono uppercase tracking-[0.3em] mb-4" style={{ color: neon }}>{clientsDataFormatted.keyCustomersBadge}</p>
                                <h2 className="text-2xl font-bold text-white mb-10">{clientsDataFormatted.keyCustomersTitle}</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-items-center">
                                    {clientsDataFormatted.items?.map((item: any, idx: number) => {
                                        const name = typeof item === 'string' ? item : item.name;
                                        const imagePath = (typeof item === 'object' && item.image)
                                            ? (item.image.startsWith('http') ? item.image : `/images/customers/${item.image}`)
                                            : `/images/customers/${name?.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}.png`;
                                        return (
                                            <div key={idx} className="p-4 border border-white/10 bg-white/[0.02] flex items-center justify-center w-full">
                                                <div className="relative w-[80px] h-[40px]">
                                                    <Image src={imagePath} alt={name || "Client"} fill className="object-contain contrast-[1.2] saturate-[1.2]" unoptimized />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {clientsDataFormatted.lookingForItems && clientsDataFormatted.lookingForItems.length > 0 && (
                                <div id="looking-for" className="scroll-mt-24 p-8 border border-white/10 bg-white/[0.02]">
                                    <p className="text-xs font-mono uppercase tracking-[0.3em] mb-4" style={{ color: neon }}>{clientsDataFormatted.lookingForBadge}</p>
                                    <h3 className="text-2xl font-bold text-white mb-6">{clientsDataFormatted.lookingForTitle}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {clientsDataFormatted.lookingForItems.map((item: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 border border-white/5 hover:border-white/10 transition-colors">
                                                <span className="text-xs font-mono" style={{ color: neon }}>{String(idx + 1).padStart(2, '0')}</span>
                                                <span className="text-gray-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ===== DARK CONTACT ===== */}
                {layoutConfig.showContact && (
                    <section id="contact" className="py-24 bg-[#0a0a0f]">
                        <div className="container-custom max-w-3xl text-center">
                            <h2 className="text-3xl font-bold text-white mb-3">{contactDataFormatted.title}</h2>
                            <p className="text-gray-500 mb-12">{contactDataFormatted.subtitle}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: contactDataFormatted.officeLabel, value: contactDataFormatted.officeValue },
                                    { label: contactDataFormatted.mobileLabel, value: contactDataFormatted.mobileValue, href: contactDataFormatted.mobileValue ? `tel:${contactDataFormatted.mobileValue.replace(/[^0-9+]/g, '')}` : null },
                                    { label: contactDataFormatted.emailLabel, value: contactDataFormatted.emailValue, href: contactDataFormatted.emailValue ? `mailto:${contactDataFormatted.emailValue}` : null },
                                    { label: contactDataFormatted.websiteLabel, value: contactDataFormatted.websiteValue, href: contactDataFormatted.websiteValue ? (contactDataFormatted.websiteValue.startsWith('http') ? contactDataFormatted.websiteValue : `https://${contactDataFormatted.websiteValue}`) : null },
                                ].filter(c => c.value).map((c, idx) => (
                                    <div key={idx} className="p-6 border border-white/10 bg-white/[0.02] text-left hover:border-white/20 transition-colors">
                                        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider mb-2">{c.label}</p>
                                        {c.href ? (
                                            <a href={c.href} className="text-white hover:brightness-110 transition-colors" style={{ color: neon }}>{c.value}</a>
                                        ) : (
                                            <p className="text-gray-300">{c.value}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {contactDataFormatted.lineValue && (
                                <div className="mt-8 flex justify-center">
                                    <a href={contactDataFormatted.lineValue.startsWith('http') ? contactDataFormatted.lineValue : `https://line.me/ti/p/~${contactDataFormatted.lineValue.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-6 border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors inline-flex flex-col items-center">
                                        <QRCodeSVG value={contactDataFormatted.lineValue.startsWith('http') ? contactDataFormatted.lineValue : `https://line.me/ti/p/~${contactDataFormatted.lineValue.replace('@', '')}`} size={120} level="H" fgColor={neon} bgColor="transparent" />
                                        <span className="mt-3 text-xs font-mono" style={{ color: neon }}>{contactDataFormatted.clickToAdd || 'LINE'}</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>
                )}

            </main>
            {/* Dark footer override */}
            <footer className="bg-[#0a0a0f] border-t border-white/10 py-8">
                <div className="container-custom text-center text-xs text-gray-600 font-mono">
                    © {new Date().getFullYear()} {footerDataFormatted.rights}
                </div>
            </footer>
        </ThemeProvider>
    );
}
