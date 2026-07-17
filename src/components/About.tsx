interface AboutProps {
    data: {
        visionBadge: string;
        visionMission: string;
        visionTitle: string;
        visionDesc1: string;
        visionDesc2: string;
        signature: string;
        stats: { label: string; value: string }[];
        trustText: string;
        showStats?: boolean;
    }
}

export default function About({ data }: AboutProps) {
    const showStats = data.showStats ?? true;

    return (
        <section id="about" className="py-24 bg-white relative">
            <div className="container-custom">
                <div className={`grid grid-cols-1 ${showStats ? 'lg:grid-cols-2' : ''} gap-16 items-start`}>
                    {/* Content Column */}
                    <div className={showStats ? '' : 'max-w-3xl mx-auto text-center'}>
                        <h2 className={`text-xl font-bold leading-7 text-brand-blue uppercase tracking-widest ${showStats ? '' : 'justify-center'}`}>{data.visionMission}</h2>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl leading-tight" dangerouslySetInnerHTML={{ __html: data.visionTitle }}>
                        </h3>
                        <div className="mt-6 space-y-6 text-lg leading-8 text-gray-600">
                            <p>
                                {data.visionDesc1}
                            </p>
                            <p>
                                {data.visionDesc2}
                            </p>
                        </div>

                    </div>

                    {/* Stats/Visual Column */}
                    {showStats && (
                        <div className="bg-white rounded-3xl p-10 shadow-xl ring-1 ring-gray-200">
                            <dl className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
                                {data.stats.map((stat) => (
                                    <div key={stat.label} className="flex flex-col gap-y-2 border-b border-gray-200 pb-4">
                                        <dt className="text-sm leading-6 text-gray-900">{stat.label}</dt>
                                        <dd className="order-first text-4xl font-bold tracking-tight text-brand-blue">
                                            {stat.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <div className="mt-10 pt-10 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-500">{data.trustText}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
