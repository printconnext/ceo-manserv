import Image from "next/image";

interface ClientsProps {
    data: {
        keyCustomersBadge: string;
        keyCustomersTitle: string;
        lookingForBadge: string;
        lookingForTitle: string;
        lookingForDesc: string;
        lookingForItems: string[];
        growingTogether: string;
    }
}

export default function Clients({ data }: ClientsProps) {
    return (
        <section className="py-24 bg-white dark:bg-black">
            <div className="container-custom">

                {/* Key Customers */}
                <div id="key-customers" className="mb-20 scroll-mt-24">
                    <div className="text-center mb-10">
                        <span className="inline-block rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm">
                            {data.keyCustomersBadge}
                        </span>
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{data.keyCustomersTitle}</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center">
                        {[
                            "KUBOTA", "SATI", "ATTG", "HITACHI", "OGIHARA", "DONKI", "YAMAHA", "HINO", "ICHIKOH", "TRA",
                            "IDAKA", "THK", "THAI NAKANO", "UNIC", "TOR", "PTS", "NISSINBO", "DID", "TDK", "HAS",
                            "SKMT", "BTKK", "BEW", "FUKOKU", "TRANSTEC", "SHOWA", "IDAC", "ENPLA", "Y_AND_R", "KANG YONG",
                            "NISSAN", "AKESONO", "TAIHO", "E_AND_C", "CPR", "NIPPON EXPRSS", "TOSHIBA", "IKEA", "INDARAMA", "DUSIT",
                            "AMCOGROUP", "ALPHA GROUP", "CENTRAL", "GREEN SPOT", "HISAMITSU"
                        ].map((name, idx) => (
                            <div key={idx} className="w-full h-full flex items-center justify-center p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group">
                                <div className="relative w-[100px] h-[50px]">
                                    <Image
                                        src={`/ceo-manserv/images/customers/${name.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}.png`}
                                        alt={name}
                                        fill
                                        className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Looking For */}
                <div id="looking-for" className="bg-brand-blue rounded-3xl p-8 sm:p-12 relative overflow-hidden isolate scroll-mt-24">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-20">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-1">
                            <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white mb-4">
                                {data.lookingForBadge}
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">{data.lookingForTitle}</h3>
                            <p className="text-blue-100">
                                {data.lookingForDesc}
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <ul className="grid grid-cols-1 gap-4">
                                {data.lookingForItems.map((item, idx) => (
                                    <li key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white hover:bg-white/20 transition-colors border border-white/10 flex gap-3 items-center">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red text-sm font-bold">
                                            {idx + 1}
                                        </span>
                                        <span className="text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative h-12 w-48 opacity-90">
                            <Image
                                src="/ceo-manserv/images/bni-logo.png"
                                alt="BNI Everest"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                        <div className="text-blue-100 text-sm">{data.growingTogether}</div>
                    </div>
                </div>

            </div >
        </section >
    );
}
