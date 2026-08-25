import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { ProfileLayoutProps } from "./ClassicLayout";

export default function MinimalLayout(props: ProfileLayoutProps) {
    const {
        themeConfig, resolvedLang, layoutConfig,
        headerData, heroData, aboutDataFormatted,
        servicesDataFormatted, experienceDataFormatted,
        clientsDataFormatted, contactDataFormatted, footerDataFormatted
    } = props;

    return (
        <ThemeProvider themeConfig={themeConfig} className={`flex flex-col min-h-screen lang-${resolvedLang} bg-white`}>
            <Header data={headerData} />
            <main className="flex-grow">

                {/* ===== MINIMAL HERO ===== */}
                {layoutConfig.showHero && (
                    <section id="hero" className="pt-40 pb-24 bg-white relative overflow-hidden">
                        {/* Subtle background glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-primary)]/5 blur-[100px] rounded-full pointer-events-none"></div>
                        
                        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                            <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto mb-10 rounded-full overflow-hidden ring-4 ring-white shadow-2xl shadow-[var(--color-primary)]/10">
                                <Image src={heroData.heroImage} alt={heroData.name} fill className="object-cover" priority unoptimized />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                                {heroData.name}
                            </h1>
                            <h2 className="text-xl text-gray-500 font-light mb-10">{heroData.title}</h2>
                            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed max-w-2xl mx-auto mb-14">
                                {heroData.quote}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                                <Link href="#contact" className="rounded-full bg-[var(--color-primary)] px-10 py-4 text-sm font-semibold text-white hover:shadow-lg hover:shadow-[var(--color-primary)]/30 hover:-translate-y-1 transition-all duration-300 tracking-wide">
                                    {heroData.contactButton}
                                </Link>
                                
                                <div className="flex items-center gap-6">
                                    <Link href="#about" className="text-sm font-medium text-gray-500 hover:text-[var(--color-primary)] transition-colors tracking-wide underline underline-offset-8 decoration-gray-200 hover:decoration-[var(--color-primary)]">
                                        {heroData.standardButton}
                                    </Link>
                                    
                                    {/* Trust badges inline */}
                                    {heroData.badges && heroData.badges.length > 0 && (
                                        <div className="flex items-center gap-6 border-l border-gray-200 pl-8 ml-2">
                                            {heroData.badges.slice(0, 2).map((badge: any, idx: number) => (
                                                <Image key={idx} src={badge.src} alt={badge.alt} width={0} height={0} sizes="100vw" className="w-auto h-[56px] object-contain drop-shadow-sm" unoptimized />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== MINIMAL ABOUT ===== */}
                {layoutConfig.showAbout && (
                    <section id="about" className="py-24 bg-gray-50 border-y border-gray-100">
                        <div className="max-w-4xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">{aboutDataFormatted.visionMission}</p>
                                <h3 className="text-3xl font-medium text-gray-900 leading-snug" dangerouslySetInnerHTML={{ __html: aboutDataFormatted.visionTitle }}></h3>
                            </div>
                            
                            <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl shadow-gray-200/40">
                                <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed mb-16 text-center max-w-2xl mx-auto">
                                    <p>{aboutDataFormatted.visionDesc1}</p>
                                    <p>{aboutDataFormatted.visionDesc2}</p>
                                </div>
                                
                                {aboutDataFormatted.showStats && aboutDataFormatted.stats && aboutDataFormatted.stats.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-100">
                                        {aboutDataFormatted.stats.map((stat: any) => (
                                            <div key={stat.label} className="text-center">
                                                <div className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-2">{stat.value}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== MINIMAL SERVICES ===== */}
                {layoutConfig.showServices && (
                    <section id="services" className="py-32 bg-white">
                        <div className="max-w-5xl mx-auto px-6">
                            <div className="mb-24 text-center">
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">{servicesDataFormatted.title}</p>
                                <h2 className="text-4xl font-semibold text-gray-900">{servicesDataFormatted.subtitle}</h2>
                            </div>
                            <div className="space-y-24 lg:space-y-40">
                                {servicesDataFormatted.items.map((item: any, idx: number) => (
                                    <div key={idx} className="group">
                                        <div className={`flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                            {/* Text Content */}
                                            <div className="w-full md:w-1/2 flex flex-col justify-center relative">
                                                {/* Large Background Number */}
                                                <div className="absolute -top-16 -left-8 text-[180px] font-black text-gray-50 opacity-50 z-0 pointer-events-none">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </div>
                                                
                                                <div className="relative z-10">
                                                    <span className="inline-block text-sm font-bold text-[var(--color-primary)] mb-4 tracking-wider">
                                                        SERVICE {String(idx + 1).padStart(2, '0')}
                                                    </span>
                                                    <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">{item.title}</h3>
                                                    <p className="text-lg text-gray-600 font-light leading-relaxed">{item.description}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Image */}
                                            <div className="w-full md:w-1/2">
                                                {item.image && (
                                                    <div className="relative h-[300px] sm:h-[400px] w-full rounded-3xl overflow-hidden bg-gray-100 shadow-2xl shadow-gray-200/60 group-hover:shadow-[var(--color-primary)]/20 transition-all duration-500">
                                                        <Image 
                                                            src={item.image?.startsWith('http') ? item.image : `/images/${item.image || 'service-1.png'}`} 
                                                            alt={item.title} 
                                                            fill 
                                                            className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                                            unoptimized 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== MINIMAL EXPERIENCE ===== */}
                {layoutConfig.showExperience && experienceDataFormatted.items && experienceDataFormatted.items.length > 0 && (
                    <section id="experience" className="py-32 bg-gray-50 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-6">
                            <div className="text-center mb-20">
                                <h2 className="text-3xl font-semibold text-gray-900">{experienceDataFormatted.title}</h2>
                                <div className="w-16 h-1 bg-[var(--color-primary)] mx-auto mt-6 rounded-full"></div>
                            </div>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                {experienceDataFormatted.items.map((item: any, idx: number) => (
                                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        {/* Icon / Dot */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-100 group-hover:bg-[var(--color-primary)] text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300">
                                            <div className="w-2 h-2 rounded-full bg-gray-400 group-hover:bg-white transition-colors duration-300"></div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                                <h3 className="font-bold text-gray-900 text-lg">{item.role}</h3>
                                                <time className="text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full mt-2 sm:mt-0">{item.period}</time>
                                            </div>
                                            <div className="text-sm font-medium text-gray-500 mb-3">{item.company}</div>
                                            <p className="text-gray-600 font-light text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== MINIMAL CLIENTS ===== */}
                {layoutConfig.showClients && (
                    <section className="py-32 bg-white">
                        <div className="max-w-5xl mx-auto px-6">
                            <div id="key-customers" className="mb-24 scroll-mt-24 text-center">
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">{clientsDataFormatted.keyCustomersBadge}</p>
                                <h2 className="text-3xl font-semibold text-gray-900 mb-12">{clientsDataFormatted.keyCustomersTitle}</h2>
                                <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
                                    {clientsDataFormatted.items?.map((item: any, idx: number) => {
                                        const name = typeof item === 'string' ? item : item.name;
                                        const imagePath = (typeof item === 'object' && item.image)
                                            ? (item.image.startsWith('http') ? item.image : `/images/customers/${item.image}`)
                                            : `/images/customers/${name?.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}.png`;
                                        return (
                                            <div key={idx} className="relative w-[120px] h-[60px] opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                                                <Image src={imagePath} alt={name || "Client"} fill className="object-contain" unoptimized />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {clientsDataFormatted.lookingForItems && clientsDataFormatted.lookingForItems.length > 0 && (
                                <div id="looking-for" className="scroll-mt-24 bg-gray-50 rounded-3xl p-10 md:p-16 border border-gray-100">
                                    <div className="text-center mb-12">
                                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">{clientsDataFormatted.lookingForBadge}</p>
                                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">{clientsDataFormatted.lookingForTitle}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {clientsDataFormatted.lookingForItems.map((item: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
                                                <span className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-bold flex items-center justify-center shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-gray-700 font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {clientsDataFormatted.associations && clientsDataFormatted.associations.length > 0 && (
                                <div className="mt-20 pt-12 border-t border-gray-100 flex flex-wrap justify-center items-center gap-10 opacity-70">
                                    {clientsDataFormatted.associations.map((assoc: any, idx: number) => (
                                        <div key={idx} className="relative h-16 w-32 sm:w-40 grayscale hover:grayscale-0 transition-all duration-300">
                                            <Image
                                                src={assoc.image ? (assoc.image.startsWith('http') ? assoc.image : `/images/${assoc.image}`) : "/images/bni-logo.png"}
                                                alt={assoc.name || "Association"}
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ===== MINIMAL CONTACT ===== */}
                {layoutConfig.showContact && (
                    <section id="contact" className="py-32 bg-[var(--color-primary)] text-white relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -bottom-[200px] -right-[200px] w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">{contactDataFormatted.title}</h2>
                            <p className="text-xl text-white/80 font-light mb-16 max-w-2xl mx-auto">{contactDataFormatted.subtitle}</p>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center text-left max-w-5xl mx-auto">
                                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {[
                                        { label: contactDataFormatted.officeLabel, value: contactDataFormatted.officeValue },
                                        { label: contactDataFormatted.officePhoneLabel, value: contactDataFormatted.officePhoneValue, href: contactDataFormatted.officePhoneValue ? `tel:${contactDataFormatted.officePhoneValue.replace(/[^0-9+]/g, '')}` : null },
                                        { label: contactDataFormatted.mobileLabel, value: contactDataFormatted.mobileValue, href: contactDataFormatted.mobileValue ? `tel:${contactDataFormatted.mobileValue.replace(/[^0-9+]/g, '')}` : null },
                                        { label: contactDataFormatted.emailLabel, value: contactDataFormatted.emailValue, href: contactDataFormatted.emailValue ? `mailto:${contactDataFormatted.emailValue}` : null },
                                        ...(contactDataFormatted.websites || []).map((w: string) => ({ label: contactDataFormatted.websiteLabel, value: w, href: w ? (w.startsWith('http') ? w : `https://${w}`) : null })),
                                    ].filter(c => c.value).map((c, idx) => (
                                        <div key={idx} className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-colors">
                                            <p className="text-xs text-white/60 uppercase tracking-widest mb-2 font-bold">{c.label}</p>
                                            {c.href ? (
                                                <a href={c.href} className="text-xl font-semibold hover:text-blue-200 transition-colors break-words">{c.value}</a>
                                            ) : (
                                                <p className="text-xl font-semibold break-words">{c.value}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="lg:col-span-1 flex justify-center lg:justify-end">
                                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
                                        <QRCodeSVG value={contactDataFormatted.lineUrl || "https://line.me/"} size={180} />
                                        <p className="text-[var(--color-primary)] font-bold mt-6 tracking-widest uppercase text-sm">LINE OFFICIAL</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

            </main>
            <Footer data={footerDataFormatted} />
        </ThemeProvider>
    );
}
