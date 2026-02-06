export default function Clients() {
    const customers = [
        "Fuji Furukawa E&C Cambodia Co. Ltd.",
        "Enplas Precision (Thailand) Co Ltd",
        "Trans Tech Engineering Co., Ltd.",
        "IDAKA (THAILAND) CO., LTD.",
        "Wakuwaku",
        "I-dac Bangkok",
        "Central Food Retail Group",
        "Kubota", "Dusit International", "Yamaha",
        "Hitachi", "IKEA", "Nissan", "TOA"
    ];

    const lookingFor = [
        "Japanese Companies/Factories that utilize Executive Chauffeur services",
        "Companies requiring long-term Van or SUV rental with drivers",
        "Corporate Airport Transfer & Vendor Transport services",
        "Organizations needing Defensive Driving & TSM Training"
    ];

    return (
        <section className="py-24 bg-white dark:bg-black">
            <div className="container-custom">

                {/* Key Customers */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <span className="inline-block rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm">
                            KEY CUSTOMERS
                        </span>
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Trusted by Leading Companies</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {customers.map((name) => (
                            <div key={name} className="h-16 flex items-center justify-center font-bold text-center text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg w-full p-4 hover:border-brand-blue hover:text-brand-blue bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                                {name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Looking For */}
                <div className="bg-brand-blue rounded-3xl p-8 sm:p-12 relative overflow-hidden isolate">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-20">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-1">
                            <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white mb-4">
                                LOOKING FOR
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Our Target Partners</h3>
                            <p className="text-blue-100">
                                We are ready to partner with your organization to elevate your corporate transport standards.
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <ul className="grid grid-cols-1 gap-4">
                                {lookingFor.map((item, idx) => (
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
                        <div className="text-white font-bold text-xl opacity-90">BNI <span className="font-light">EVEREST</span></div>
                        <div className="text-blue-100 text-sm">Growing Together</div>
                    </div>
                </div>

            </div>
        </section>
    );
}
