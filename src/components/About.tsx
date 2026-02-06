export default function About() {
    const stats = [
        { label: 'Years Experience', value: '20+' },
        { label: 'Service Trips', value: '4M+' },
        { label: 'Professional Drivers', value: '300+' },
        { label: 'Corporate Clients', value: '100+' },
    ]

    return (
        <section id="about" className="py-24 sm:py-32 bg-white dark:bg-black">
            <div className="container-custom">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-brand-blue">About MAN SERV</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        International Standard Service <br /> for Supervisor Travel
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        We are experts in executive automotive travel for leading executives, companies, and factories. With the highest safety standards and intensive training, we ensure every journey is smooth and secure.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">{stat.label}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}
