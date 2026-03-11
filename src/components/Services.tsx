import Image from "next/image";
import React from 'react';
import { ServiceIcons, defaultServiceIconOrder } from "./IconLibrary";

interface ServicesProps {
    data: {
        title: string;
        subtitle: string;
        items: {
            title: string;
            description: string;
            icon?: string;
        }[];
    }
}

export default function Services({ data }: ServicesProps) {

    // Fallback mapping for older saved profiles using incorrect icon names
    const legacyIconMap: Record<string, string> = {
        car: 'user',
        crown: 'van',
        shield: 'location',
        plane: 'globe'
    };

    const services = data.items.map((item, index) => {
        let rawIconKey = item.icon || defaultServiceIconOrder[index % defaultServiceIconOrder.length];
        const iconKey = legacyIconMap[rawIconKey] || rawIconKey;
        const IconComponent = ServiceIcons[iconKey] || ServiceIcons.star;

        return {
            ...item,
            icon: IconComponent,
            displayImage: (item as any).image || 'service-1.png'
        };
    });

    return (
        <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            {/* Decorative background blob */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200 blur-3xl mix-blend-multiply"></div>
                <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-blue-100 blur-3xl mix-blend-multiply"></div>
            </div>

            <div className="container-custom">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--color-primary)] dark:text-[var(--color-primary)] sm:text-4xl">{data.title}</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        {data.subtitle}
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {services.map((service) => (
                            <div key={service.title} className="flex flex-col bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 hover:ring-[var(--color-primary)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden">

                                {/* Service Image */}
                                <div className="relative h-48 w-full bg-gray-200">
                                    <Image
                                        src={service.displayImage?.startsWith('http') ? service.displayImage : `/images/${service.displayImage}`}
                                        alt={service.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                </div>

                                <div className="p-6 md:p-8 flex flex-col flex-auto">
                                    <dt className="flex items-center gap-x-4 text-xl md:text-2xl font-bold leading-7 text-gray-900 mb-4">
                                        <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex-shrink-0">
                                            <service.icon className="h-6 w-6 flex-none" aria-hidden="true" />
                                        </div>
                                        {service.title}
                                    </dt>
                                    <dd className="flex flex-auto flex-col text-sm md:text-base leading-7 text-gray-500">
                                        <p className="flex-auto">{service.description}</p>
                                    </dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
