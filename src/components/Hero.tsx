import Link from "next/link";
import Image from "next/image";

interface HeroProps {
    data: {
        badge: string;
        name: string;
        title: string;
        quote: string;
        contactButton: string;
        standardButton: string;
        role: string;
        heroImage: string;
        backgroundPattern: string;
        badges: { src: string; alt: string }[];
        heroGallery: string[];
        lang?: string;
        media: {
            heroImage: string;
            backgroundPattern?: string;
        };
    }
}

export default function Hero({ data }: HeroProps) {
    return (
        <section
            id="hero"
            className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-[var(--color-primary)]"
            style={data.media.backgroundPattern ? {
                backgroundImage: `url(${data.media.backgroundPattern})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            } : {}}
        >
            {/* Background Effects */}
            {!data.media.backgroundPattern && (
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                        <div className="w-[800px] h-[800px] bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
                    </div>
                </div>
            )}


            {/* Main Content */}
            <div className="container-custom mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Text Content */}
                    <div className="lg:col-span-7 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                            <div className="inline-flex items-center space-x-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-[var(--color-primary)] shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                <span className="uppercase tracking-wider">{data.badge}</span>
                            </div>
                            {data.lang && (
                                <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-tighter">
                                    {data.lang}
                                </div>
                            )}
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6 leading-tight drop-shadow-sm">
                            {data.name}
                        </h1>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-100 mb-8">
                            {data.title}
                        </h2>

                        <blockquote className="border-l-4 border-[var(--color-accent)] pl-6 italic text-xl text-blue-50/90 mb-10 max-w-2xl mx-auto lg:mx-0">
                            {data.quote}
                        </blockquote>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                            <Link
                                href="#contact"
                                className="w-full sm:w-auto rounded-full bg-white px-8 py-3.5 text-base font-bold text-[var(--color-primary)] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-blue-50 transition-all hover:-translate-y-1"
                            >
                                {data.contactButton}
                            </Link>
                            <div>
                                <Link href="#about" className="text-base font-semibold leading-6 text-white hover:text-blue-200 transition-colors flex items-center gap-2 mb-4">
                                    {data.standardButton} <span aria-hidden="true">→</span>
                                </Link>

                                {/* Trust Badges / Certifications - Moved Under Button */}
                                <div className="flex items-center gap-4">
                                    {data.badges.slice(0, 2).map((badge, idx) => (
                                        <Image
                                            key={idx}
                                            src={badge.src}
                                            alt={badge.alt}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-auto h-[60px] sm:h-[80px] object-contain opacity-90 hover:opacity-100 transition-opacity"
                                            unoptimized
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image/Visual - Portrait Style */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
                        <div className="relative w-[300px] h-[420px] sm:w-[380px] sm:h-[520px]">
                            {/* Frame */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 translate-x-4 translate-y-4"></div>

                            {/* Image Container */}
                            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 to-black ring-1 ring-white/10">
                                <Image
                                    src={data.heroImage}
                                    alt={data.name}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />

                                {/* Overlay Gradient for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                {/* Name on image */}
                                <div className="absolute bottom-6 left-6">
                                    <p className="text-white text-lg font-bold leading-tight">{data.name}</p>
                                    {data.role && <p className="text-blue-200 text-xs font-medium tracking-wider mt-1">{data.role}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Gallery Section - Optimized for up to 4 images */}
                <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-95 pb-10 relative z-10 w-full">
                    {data.heroGallery.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 group cursor-pointer bg-white/5 ring-1 ring-white/10">
                            <Image
                                src={img}
                                alt={`Gallery ${idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/10 transition-colors duration-500"></div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
                <svg className="w-6 h-6 text-white/50" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
            </div>
        </section >
    );
}

