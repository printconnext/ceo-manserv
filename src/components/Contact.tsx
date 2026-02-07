import Image from "next/image";

interface ContactProps {
    data: {
        title: string;
        subtitle: string;
        office: string;
        mobile: string;
        email: string;
        website: string;
        lineTitle: string;
        clickToAdd: string;
        preferEmail: string;
    }
}

export default function Contact({ data }: ContactProps) {
    return (
        <section id="contact" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900/50">
            <div className="container-custom">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{data.title}</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        {data.subtitle}
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-xl sm:mt-20">
                    <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-2 mb-12">
                        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-brand-blue mb-2">{data.office}</h3>
                            <a href="tel:0219252712" className="text-gray-600 dark:text-gray-300 hover:text-brand-red transition-colors">02 192 5271-2</a>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-brand-blue mb-2">{data.mobile}</h3>
                            <a href="tel:0937893259" className="text-gray-600 dark:text-gray-300 hover:text-brand-red transition-colors">093 789 3259</a>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-brand-blue mb-2">{data.email}</h3>
                            <a href="mailto:samartch@manserv.co.th" className="text-gray-600 dark:text-gray-300 hover:text-brand-red transition-colors">samartch@manserv.co.th</a>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-brand-blue mb-2">{data.website}</h3>
                            <a href="https://www.manserv.co.th" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-brand-red transition-colors">www.manserv.co.th</a>
                        </div>
                    </div>

                    {/* LINE QR Code */}
                    <div className="flex flex-col items-center justify-center mb-12">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{data.lineTitle}</p>
                        <a
                            href="https://line.me/ti/p/fwS0tgCpsb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                        >
                            <div className="relative w-40 h-40">
                                <Image
                                    src="/ceo-manserv/images/line-qr.png"
                                    alt="LINE QR Code"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            <div className="mt-2 text-center text-sm font-medium text-[#00b900] group-hover:text-[#009900]">
                                {data.clickToAdd}
                            </div>
                        </a>
                    </div>



                    <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        {data.preferEmail} <a href="mailto:samartch@manserv.co.th" className="font-semibold text-blue-600 hover:text-blue-500">samartch@manserv.co.th</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
