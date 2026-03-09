import Footer from "@/components/Footer";
import { th } from "@/data/locales/th";
import Link from "next/link";
import Image from "next/image";

export default function SaaSLandingPage() {
    return (
        <div className="flex flex-col min-h-screen lang-th bg-white font-sans text-gray-900 selection:bg-blue-100">
            {/* Minimalist Header */}
            <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-20" aria-label="Global">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-sm">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="font-semibold text-xl tracking-tight text-gray-900 group-hover:opacity-80 transition-opacity">
                                CEO<span className="font-light text-brand-blue">profile</span>
                            </div>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
                            <a href="#features" className="hover:text-brand-blue transition-colors">คุณสมบัติ</a>
                            <a href="#solutions" className="hover:text-brand-blue transition-colors">โซลูชัน</a>
                            <a href="#testimonials" className="hover:text-brand-blue transition-colors">รีวิว</a>
                            <a href="#pricing" className="hover:text-brand-blue transition-colors">ราคา</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/api/auth/signin?callbackUrl=/dashboard" className="hidden sm:block text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors">
                            เข้าสู่ระบบ
                        </Link>
                        <Link href="/api/auth/signin?callbackUrl=/dashboard" className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 hover:shadow-md transition-all">
                            สร้างโปรไฟล์ฟรี
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gray-50/50 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pb-40">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                            {/* Left Text */}
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-xs font-semibold tracking-wide uppercase mb-8">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                                    Focus On What Matters
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
                                    ยกระดับ <br className="hidden sm:block" />
                                    <span className="text-brand-blue">ภาพลักษณ์ผู้บริหาร</span> <br className="hidden sm:block" />
                                    ด้วย Digital Profile
                                </h1>

                                <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-lg">
                                    สร้างตัวตนบนโลกดิจิทัลที่น่าเชื่อถือ สะท้อนความเป็นผู้นำ และเอกลักษณ์องค์กรของคุณ ด้วยแพลตฟอร์มนามบัตรและโปรไฟล์ระดับพรีเมียม
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <Link href="/api/auth/signin?callbackUrl=/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                                        เริ่มต้นใช้งาน
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </Link>
                                    <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all">
                                        ดูตัวอย่าง
                                    </a>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5] transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                                    <Image
                                        src="/landing_mockup.png"
                                        alt="Executive Professional Mockup"
                                        fill
                                        className="object-cover object-center"
                                        priority
                                    />
                                    {/* Overlay Gradient for elegance */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute -z-10 -top-8 -right-8 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                                <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-gray-200 rounded-full blur-3xl opacity-50"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section 1 */}
                <section id="features" className="py-24 sm:py-32 bg-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                            <h2 className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-3 text-teal-700">Distinction By Design</h2>
                            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-6 font-prompt">
                                โครงสร้างที่สง่างามและน่าเชื่อถือ
                            </p>
                            <p className="text-lg text-gray-600">
                                ปรับแต่งได้ตามความต้องการ เพื่อให้สอดคล้องกับภาพลักษณ์องค์กรและคุณค่าความเป็นผู้นำของคุณอย่างสมบูรณ์แบบ
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature Card 1 */}
                            <div className="flex flex-col bg-gray-50/50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center mb-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">รองรับหลายภาษา</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                                    เชื่อมต่อและสื่อสารกับพาร์ทเนอร์ทั่วโลก รองรับเนื้อหาทั้งภาษาอังกฤษ, ไทย, จีน, และญี่ปุ่น
                                </p>
                                <div className="flex gap-2">
                                    {['EN', 'TH', 'ZH', 'JP'].map(lang => (
                                        <span key={lang} className="text-[10px] font-bold px-2 py-1 bg-white border border-gray-200 rounded text-gray-500 shadow-sm">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Feature Card 2 */}
                            <div className="flex flex-col bg-gray-50/50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center mb-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">นามบัตรดิจิทัล</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                                    แชร์ข้อมูลการติดต่อได้ทันทีผ่าน QR Code พร้อมดาวน์โหลดไฟล์ .vcf บันทึกลงสมาร์ทโฟนอัตโนมัติ
                                </p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wider">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    SCAN TO CONNECT
                                </div>
                            </div>

                            {/* Feature Card 3 */}
                            <div className="flex flex-col bg-gray-50/50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center mb-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">เพิ่มความน่าเชื่อถือ</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                                    แสดงประวัติการทำงาน รางวัล และผลงานที่โดดเด่นอย่างมืออาชีพยกระดับภาพลักษณ์ให้กับองค์กร
                                </p>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-brand-blue">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dashboard Section */}
                <section id="solutions" className="py-24 sm:py-32 bg-gray-50 border-y border-gray-100 overflow-hidden">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left Side: Abstract Mockups */}
                            <div className="relative">
                                <div className="absolute inset-x-0 -bottom-12 -top-12 bg-blue-100/40 blur-3xl rounded-full opacity-30 transform -rotate-6"></div>
                                <div className="relative flex gap-6 items-center">
                                    {/* Real-ish Web Mockup */}
                                    <div className="w-[85%] aspect-video bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transform -rotate-2 relative">
                                        {/* Browser Header */}
                                        <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                            </div>
                                            <div className="bg-white rounded-md px-3 py-1 flex-grow text-[8px] text-gray-400 font-medium truncate">ceoprofile.site/manserv/samarth</div>
                                        </div>
                                        {/* Browser Content (Mini Profile) */}
                                        <div className="p-4 grid grid-cols-12 gap-4 h-full">
                                            <div className="col-span-4 h-full relative rounded-lg overflow-hidden bg-gray-100">
                                                <Image
                                                    src="/landing_mockup.png"
                                                    alt="Profile Preview"
                                                    fill
                                                    className="object-cover object-center"
                                                />
                                            </div>
                                            <div className="col-span-8 flex flex-col justify-center gap-3">
                                                <div className="space-y-1">
                                                    <div className="h-3 w-1/4 bg-blue-50 rounded"></div>
                                                    <div className="h-5 w-3/4 bg-gray-900 rounded"></div>
                                                    <div className="h-3 w-1/2 bg-gray-400 rounded"></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div className="h-10 bg-gray-50 rounded-lg border border-gray-100"></div>
                                                    <div className="h-10 bg-gray-50 rounded-lg border border-gray-100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real-ish Mobile Mockup (Vertical) */}
                                    <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-[35%] aspect-[1/2] bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-900 overflow-hidden ring-4 ring-white/50">
                                        <div className="h-full bg-white relative flex flex-col">
                                            {/* Status Bar */}
                                            <div className="h-8 flex justify-center items-end pb-1 bg-white">
                                                <div className="w-16 h-4 bg-gray-900 rounded-b-xl"></div>
                                            </div>
                                            {/* Content */}
                                            <div className="flex-grow flex flex-col items-center p-4">
                                                <div className="w-20 h-20 rounded-full border-2 border-brand-blue overflow-hidden relative mb-4 shadow-lg">
                                                    <Image
                                                        src="/landing_mockup.png"
                                                        alt="Mobile Profile"
                                                        fill
                                                        className="object-cover object-center"
                                                    />
                                                </div>
                                                <div className="h-3 w-3/4 bg-gray-900 rounded mb-2"></div>
                                                <div className="h-2 w-1/2 bg-gray-400 rounded mb-6"></div>

                                                {/* Mini QR Simulation */}
                                                <div className="w-24 h-24 bg-white border border-gray-200 rounded-xl p-2 shadow-inner mb-4 flex items-center justify-center">
                                                    <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=vcard')] bg-contain opacity-80"></div>
                                                </div>
                                                <div className="h-6 w-full bg-brand-blue rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Text & Checklist */}
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-6">
                                    จัดการภาพลักษณ์คุณ<br />ได้อย่างง่ายดาย
                                </h2>
                                <p className="text-lg text-gray-600 mb-10">
                                    ควบคุมการนำเสนอตัวตนดิจิทัลของคุณได้จากทุกอุปกรณ์ ด้วยระบบที่ใช้งานง่ายและรวดเร็ว ออกแบบมาเพื่อผู้บริหารที่ไม่มีเวลาว่าง
                                </p>

                                <ul className="space-y-8">
                                    {[
                                        {
                                            title: "อัปเดตข้อมูลแบบเรียลไทม์",
                                            desc: "ปรับปรุงประวัติการทำงาน และเป้าหมายใหม่ๆ ของคุณได้ทันทีผ่านเว็บบราวเซอร์ใดก็ได้",
                                        },
                                        {
                                            title: "แสดงผลงานที่โดดเด่น",
                                            desc: "ไฮไลต์ความเชี่ยวชาญ และตำแหน่งในบอร์ดบริหารได้อย่างมีระดับ",
                                        },
                                        {
                                            title: "ตั้งค่าความเป็นส่วนตัว",
                                            desc: "สามารถควบคุมและเลือกว่าข้อมูลส่วนไหนที่พร้อมจะนำเสนอต่อสาธารณะ",
                                        }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-brand-blue">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                                                <p className="text-gray-600 text-sm">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="py-24 sm:py-32 bg-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-6">
                                ได้รับความไว้วางใจจาก<br />ผู้นำในอุตสาหกรรม
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Arthur Sterling",
                                    role: "CEO, GLOBAL TECH",
                                    quote: "CEOprofile ได้เปลี่ยนวิธีการนำเสนอตัวตนต่อพาร์ทเนอร์ชาวต่างชาติของผมไปอย่างสิ้นเชิง ดีไซน์ที่สะอาดตาสะท้อนถึงมูลค่าองค์กรเราได้เป็นอย่างดี",
                                    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                },
                                {
                                    name: "Elena Vance",
                                    role: "MANAGING DIRECTOR, ZENITH",
                                    quote: "ฟีเจอร์นามบัตรดิจิทัล เปลี่ยนเกมการสนทนาในงานประชุม มันมีความทันสมัย รวดเร็ว และเป็นที่น่าจดจำ",
                                    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                },
                                {
                                    name: "Marcus Thorne",
                                    role: "FOUNDER, THORNE & CO.",
                                    quote: "ความปลอดภัยและความเป็นมืออาชีพคือสิ่งที่ผมกังวลที่สุด CEOprofile ตอบโจทย์เกินคาดในทั้งสองด้าน",
                                    img: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                }
                            ].map((person, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full overflow-hidden mb-4 ring-2 ring-gray-200">
                                        <Image src={person.img} alt={person.name} width={56} height={56} className="object-cover" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">{person.name}</h4>
                                    <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-6">{person.role}</p>
                                    <p className="text-gray-600 text-sm italic italic leading-relaxed">"{person.quote}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-brand-blue text-white relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Abstract wave or curve via CSS */}
                        <div className="absolute -bottom-1/2 left-1/2 w-[150%] h-[150%] transform -translate-x-1/2 bg-blue-900/20 rounded-[100%]"></div>
                        <div className="absolute -bottom-3/4 left-1/2 w-[120%] h-[150%] transform -translate-x-1/2 bg-blue-800/10 rounded-[100%]"></div>
                    </div>

                    <div className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8 text-center">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                            พร้อมที่จะสร้างตำนานดิจิทัล<br />ของคุณหรือยัง?
                        </h2>
                        <p className="text-blue-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
                            เข้าร่วมเป็นส่วนหนึ่งของผู้บริหารระดับแนวหน้า สร้างตัวตนและขยายเครือข่ายระดับโลกตั้งแต่วันนี้
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/api/auth/signin?callbackUrl=/dashboard" className="rounded-lg bg-white px-8 py-4 text-sm font-bold text-brand-blue shadow-lg hover:bg-gray-50 hover:scale-105 transition-all">
                                เริ่มต้นสร้างโปรไฟล์
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Existing Footer styling will apply, ensure it is imported correctly */}
            <Footer data={th.footer} />
        </div>
    );
}
