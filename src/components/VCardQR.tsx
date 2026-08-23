"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";


interface VCardQRProps {
    fullName: string;
    portraitUrl?: string;
    qrValue: string;        // Simple vCard for QR
    fullVCardString: string; // Full vCard for Download
    onClose?: () => void;
    primaryColor?: string;
    labels?: {
        title?: string;
        scanMe?: string;
        downloadFullBtn?: string;
    };
}

export default function VCardQR({ 
    fullName, 
    portraitUrl, 
    qrValue, 
    fullVCardString, 
    onClose, 
    primaryColor = "#00318C", 
    labels 
}: VCardQRProps) {
    const handleDownload = () => {
        if (qrValue && qrValue.startsWith('http')) {
            window.location.href = qrValue;
            return;
        }
        const element = document.createElement("a");
        const file = new Blob([fullVCardString], { type: 'text/vcard' });
        element.href = URL.createObjectURL(file);
        element.download = `${fullName.replace(/\s+/g, '_')}_full.vcf`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[550px] w-full max-w-md mx-auto bg-[#0a0a0a] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            {/* Close Button if modal */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 text-gray-400 hover:text-white transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            )}

            {/* Title */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full text-center px-4 pointer-events-none flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-300">{labels?.title || "QR Code Namecard"}</h3>
                <span className="text-[10px] font-bold text-amber-500 mt-1 bg-amber-500/10 px-2 py-0.5 rounded-full">[TEST: {new Date().toLocaleTimeString('th-TH')}]</span>
            </div>

            {/* Profile Picture */}
            <div className="mt-12 mb-6">
                <div
                    className="w-28 h-28 rounded-full border-2 border-gray-800 overflow-hidden relative flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                >
                    {portraitUrl ? (
                        <Image src={portraitUrl} alt={fullName} fill className="object-cover" />
                    ) : (
                        <div className="text-white text-3xl font-bold">
                            {fullName.charAt(0)}
                        </div>
                    )}
                </div>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold mb-10 text-center uppercase tracking-tight">{fullName}</h2>

            {/* QR Code Container */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center">
                <QRCodeSVG
                    value={qrValue}
                    size={350}
                    level="M"
                    includeMargin={false}
                />
            </div>

            {/* Instruction */}
            <p className="mt-8 text-sm font-medium text-gray-400 tracking-wide">
                {labels?.scanMe || "Scan to add me"}
            </p>

            {/* Action Button */}
            <button
                onClick={handleDownload}
                className="mt-10 w-full py-4 px-6 text-white rounded-full font-bold transition-all transform active:scale-95 shadow-xl shadow-black/20 text-center"
                style={{ backgroundColor: primaryColor }}
            >
                {labels?.downloadFullBtn || "Save Full Contact (.vcf)"}
            </button>
        </div>
    );
}
