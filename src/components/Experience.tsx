const positions = [
    {
        role: 'Chief Executive Officer',
        company: 'TechVision Global',
        period: '2018 - Present',
        description: 'Leading a team of 500+ across 3 continents. Spearheaded digital transformation resulting in 200% revenue growth.',
    },
    {
        role: 'VP of Operations',
        company: 'Innovate Corp',
        period: '2012 - 2018',
        description: 'Optimized supply chain efficiency and expanded market presence in Southeast Asia.',
    },
    {
        role: 'Director of Business Development',
        company: 'StartUp Inc',
        period: '2008 - 2012',
        description: 'Secured Series B funding and established strategic partnerships with Fortune 500 companies.',
    },
];

export default function Experience() {
    return (
        <section id="experience" className="py-24 sm:py-32 bg-white dark:bg-black">
            <div className="container-custom max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Professional Journey</h2>
                </div>

                <div className="space-y-12 relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 md:ml-6 pl-8 md:pl-12">
                    {positions.map((item, index) => (
                        <div key={index} className="relative">
                            <span className="absolute -left-[41px] md:-left-[59px] top-1 h-6 w-6 rounded-full bg-blue-600 ring-4 ring-white dark:ring-black"></span>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.role}</h3>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.period}</span>
                            </div>
                            <p className="text-base font-semibold text-gray-600 dark:text-gray-400 mb-3">{item.company}</p>
                            <p className="text-base leading-7 text-gray-600 dark:text-gray-300">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
