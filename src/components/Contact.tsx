import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

interface ContactProps {
    data: {
        title: string;
        subtitle: string;

        officeLabel: string;
        officeValue: string;

        mobileLabel: string;
        mobileValue: string;

        emailLabel: string;
        emailValue: string;

        websiteLabel: string;
        websiteValue: string;

        lineLabel: string;
        lineValue: string;

        clickToAdd: string;
        clickToCall: string;
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
                        {/* Office Address */}
                        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{data.officeLabel || "Office Address"}</h3>
                            <p className="text-lg font-semibold text-brand-blue dark:text-brand-orange text-center">{data.officeValue || "-"}</p>
                        </div>

                        {/* Mobile Phone */}
                        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{data.mobileLabel || "Mobile Phone"}</h3>
                            {data.mobileValue ? (
                                <a href={`tel:${data.mobileValue.replace(/[^0-9+]/g, '')}`} className="text-lg font-semibold text-brand-blue dark:text-brand-orange hover:text-brand-red transition-colors flex items-center justify-center gap-2">
                                    <span>{data.mobileValue}</span>
                                </a>
                            ) : (
                                <p className="text-lg font-semibold text-gray-300">-</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{data.emailLabel || "Email"}</h3>
                            {data.emailValue ? (
                                <a href={`mailto:${data.emailValue}`} className="text-lg font-semibold text-brand-blue dark:text-brand-orange hover:text-brand-red transition-colors text-center break-all">
                                    {data.emailValue}
                                </a>
                            ) : (
                                <p className="text-lg font-semibold text-gray-300">-</p>
                            )}
                        </div>

                        {/* Website */}
                        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{data.websiteLabel || "Website"}</h3>
                            {data.websiteValue ? (
                                <a href={data.websiteValue.startsWith('http') ? data.websiteValue : `https://${data.websiteValue}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-brand-blue dark:text-brand-orange hover:text-brand-red transition-colors text-center break-all">
                                    {data.websiteValue}
                                </a>
                            ) : (
                                <p className="text-lg font-semibold text-gray-300">-</p>
                            )}
                        </div>
                    </div>

                    {/* LINE QR Code */}
                    {data.lineValue && (
                        <div className="flex flex-col items-center justify-center mb-12">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{data.lineLabel}</p>
                            <a
                                href={data.lineValue.startsWith('http') ? data.lineValue : `https://line.me/ti/p/~${data.lineValue.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group flex flex-col items-center"
                            >
                                <div className="bg-white p-2 rounded-xl">
                                    <QRCodeSVG
                                        value={data.lineValue.startsWith('http') ? data.lineValue : `https://line.me/ti/p/~${data.lineValue.replace('@', '')}`}
                                        size={160}
                                        level="H"
                                        includeMargin={false}
                                        fgColor="#00b900"
                                    />
                                </div>
                                <div className="mt-4 text-center text-sm font-bold text-[#00b900] group-hover:text-[#009900]">
                                    {data.clickToAdd}
                                </div>
                            </a>
                        </div>
                    )}

                    {data.emailValue && (
                        <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                            {data.preferEmail} <a href={`mailto:${data.emailValue}`} className="font-semibold text-blue-600 hover:text-blue-500">{data.emailValue}</a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
