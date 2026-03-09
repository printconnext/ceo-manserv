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
        items?: any[];
        associations?: any[];
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
                        {(data as any).items?.map((item: any, idx: number) => {
                            // Support legacy string names or structured {name, image} objects
                            const name = typeof item === 'string' ? item : item.name;
                            const imagePath = (typeof item === 'object' && item.image)
                                ? (item.image.startsWith('http') ? item.image : `/images/customers/${item.image}`)
                                : `/images/customers/${name.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}.png`;

                            return (
                                <div key={idx} className="w-full h-full flex items-center justify-center p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group">
                                    <div className="relative w-[100px] h-[50px]">
                                        <Image
                                            src={imagePath}
                                            alt={name || "Client Logo"}
                                            fill
                                            className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            );
                        })}
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

                    <div className="mt-8 pt-8 border-t border-white/20 sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-6 mb-4 sm:mb-0">
                            {(data.associations || []).map((assoc: any, idx: number) => (
                                <div key={idx} className="relative h-20 w-40 sm:w-56 opacity-90 transition-opacity hover:opacity-100">
                                    <Image
                                        src={assoc.image ? (assoc.image.startsWith('http') ? assoc.image : `/images/${assoc.image}`) : "/images/bni-logo.png"}
                                        alt={assoc.name || "Association Logo"}
                                        fill
                                        className="object-contain object-left"
                                        unoptimized
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-blue-100 text-sm text-right mt-4">{data.growingTogether}</div>
                    </div>
                </div>

            </div >
        </section >
    );
}
