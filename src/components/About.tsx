interface AboutProps {
    data: {
        visionBadge: string;
        visionTitle: string;
        visionDesc1: string;
        visionDesc2: string;
        signature: string;
        stats: { label: string; value: string }[];
        trustText: string;
    }
}

export default function About({ data }: AboutProps) {
    return (
        <section id="about" className="py-24 bg-white dark:bg-black relative">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Content Column */}
                    <div>
                        <h2 className="text-xl font-bold leading-7 text-brand-blue uppercase tracking-widest">{data.visionBadge}</h2>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl leading-tight" dangerouslySetInnerHTML={{ __html: data.visionTitle }}>
                        </h3>
                        <div className="mt-6 space-y-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            <p>
                                {data.visionDesc1}
                            </p>
                            <p>
                                {data.visionDesc2}
                            </p>
                        </div>

                        {/* Signature (Placeholder text/font) */}
                        <div className="mt-10">
                            <p className="font-handwriting text-2xl text-gray-500 italic">{data.signature}</p>
                        </div>
                    </div>

                    {/* Stats/Visual Column */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-10 shadow-xl ring-1 ring-gray-900/5">
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
                            {data.stats.map((stat) => (
                                <div key={stat.label} className="flex flex-col gap-y-2 border-b border-gray-200 dark:border-gray-800 pb-4">
                                    <dt className="text-sm leading-6 text-gray-500 dark:text-gray-400">{stat.label}</dt>
                                    <dd className="order-first text-4xl font-bold tracking-tight text-brand-blue dark:text-blue-400">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-800 text-center">
                            <p className="text-sm text-gray-500">{data.trustText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
