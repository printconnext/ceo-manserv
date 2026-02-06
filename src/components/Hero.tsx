import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative isolate pt-14 dark:bg-gray-900">
            <div className="py-24 sm:py-32 lg:pb-40">
                <div className="container-custom mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="max-w-2xl px-6 lg:px-0 mx-auto lg:mx-0 text-center lg:text-left">
                            <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-brand-blue dark:bg-blue-900/30 dark:text-blue-300">
                                Samart Chaiya (Sam)
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
                                Man Management <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-500">Service Co., Ltd.</span>
                                <span className="block text-2xl mt-2 font-medium text-gray-600 dark:text-gray-400">(Chauffeurs & Vehicle Rental)</span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                We are leading experts in executive road travel, providing executive chauffeur services and rental cars with a driver, backed by over 20 years of experience.
                            </p>
                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                                <Link
                                    href="#contact"
                                    className="rounded-full bg-brand-blue px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue transition-all hover:scale-105"
                                >
                                    ติดต่อเรา
                                </Link>
                                <Link href="#services" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-brand-blue transition-colors">
                                    ดูบริการของเรา <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Image/Visual */}
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow flex justify-center lg:justify-end">
                            <div className="relative w-72 h-96 sm:w-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-900/10 rotate-3 hover:rotate-0 transition-transform duration-500">
                                {/* Placeholder for CEO Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 dark:bg-gray-700">
                                    <span className="text-lg font-medium">รูปคุณ Samart Chaiya</span>
                                </div>
                                {/* <Image 
                    src="/images/ceo-portrait.jpg" 
                    alt="Samart Chaiya" 
                    fill 
                    className="object-cover"
                    priority
                 /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Background decoration */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
            </div>
        </section >
    );
}
