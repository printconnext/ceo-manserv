"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteProfileButtonProps {
    profileId: string;
    profileName: string;
}

export default function DeleteProfileButton({ profileId, profileName }: DeleteProfileButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`คุณต้องการลบโปรไฟล์ของ "${profileName}" ใช่หรือไม่?\nการกระทำนี้ไม่สามารถย้อนคืนได้`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/profile?id=${profileId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh(); // Refresh dashboard to show updated list
            } else {
                const data = await res.json();
                alert(data.error || "เกิดข้อผิดพลาดในการลบโปรไฟล์");
            }
        } catch (error) {
            alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            title="ลบโปรไฟล์"
        >
            {isDeleting ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            )}
        </button>
    );
}
