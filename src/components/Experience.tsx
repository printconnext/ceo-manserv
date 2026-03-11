"use client";

interface ExperienceItem {
    role: string;
    company: string;
    period: string;
    description: string;
}

interface ExperienceProps {
    data: {
        title: string;
        items: ExperienceItem[];
    }
}

export default function Experience({ data }: ExperienceProps) {
    if (!data?.items || data.items.length === 0) return null;

    return (
        <section id="experience" className="py-24 sm:py-32 bg-white">
            <div className="container-custom max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{data.title || 'Professional Journey'}</h2>
                </div>

                <div className="space-y-12 relative border-l-2 border-gray-200 ml-3 md:ml-6 pl-8 md:pl-12">
                    {data.items.map((item, index) => (
                        <div key={index} className="relative group">
                            <span className="absolute -left-[41px] md:-left-[59px] top-1 h-6 w-6 rounded-full bg-[var(--color-primary)] ring-4 ring-white group-hover:scale-110 transition-transform"></span>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{item.role}</h3>
                                <span className="text-sm font-medium text-[var(--color-primary)] mt-1 sm:mt-0">{item.period}</span>
                            </div>
                            <p className="text-base font-semibold text-gray-700 mb-3">{item.company}</p>
                            <p className="text-base leading-7 text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
