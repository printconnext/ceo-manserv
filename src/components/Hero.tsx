
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
    }
}

export default function Hero({ data }: HeroProps) {
    return (
        <section className="relative isolate pt-14 bg-brand-blue text-white overflow-hidden min-h-[90vh] flex items-center">
            <div className="container-custom mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Text Content */}
                    <div className="lg:col-span-7 text-center lg:text-left">
                        <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-50 ring-1 ring-inset ring-white/20 mb-8 backdrop-blur-sm">
                            <span className="uppercase tracking-wider">{data.badge}</span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6 leading-tight drop-shadow-sm">
                            {data.name}
                        </h1>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-100 mb-8">
                            {data.title}
                        </h2>

                        <blockquote className="border-l-4 border-brand-red pl-6 italic text-xl text-blue-50/90 mb-10 max-w-2xl mx-auto lg:mx-0">
                            {data.quote}
                        </blockquote>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                            <Link
                                href="#contact"
                                className="w-full sm:w-auto rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-blue shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-blue-50 transition-all hover:-translate-y-1"
                            >
                                {data.contactButton}
                            </Link>
                            <Link href="#about" className="text-base font-semibold leading-6 text-white hover:text-blue-200 transition-colors flex items-center gap-2">
                                {data.standardButton} <span aria-hidden="true">→</span>
                            </Link>

                            {/* Trust Badges / Certifications */}
                            <div className="hidden sm:block w-px h-10 bg-white/20 mx-2"></div>
                            <div className="flex items-center gap-6 mt-4 sm:mt-0">
                                <Image
                                    src="/ceo-manserv/images/logo-sha.png"
                                    alt="SHA Plus"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-auto h-[80px] sm:h-[110px] object-contain opacity-90 hover:opacity-100 transition-opacity"
                                    unoptimized
                                />
                                <Image
                                    src="/ceo-manserv/images/logo-iso.png"
                                    alt="ISO 9001"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-auto h-[80px] sm:h-[110px] object-contain opacity-90 hover:opacity-100 transition-opacity"
                                    unoptimized
                                />
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
                                    src="/ceo-manserv/images/ceo-portrait.png"
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
                                    <p className="text-white text-lg font-bold">{data.name}</p>
                                    <p className="text-blue-200 text-xs uppercase tracking-wider">{data.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-90 pb-10">
                    {['hero-gallery-1.png', 'hero-gallery-2.png', 'hero-gallery-3.png', 'hero-gallery-4.png'].map((img, idx) => (
                        <div key={idx} className="relative h-32 sm:h-40 rounded-xl overflow-hidden shadow-lg border border-white/10 group cursor-pointer bg-white/5">
                            <Image
                                src={`/ceo-manserv/images/${img}`}
                                alt={`Service ${idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
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

