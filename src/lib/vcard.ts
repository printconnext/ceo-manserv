// i:\ceo-profile\src\lib\vcard.ts

export interface VCardData {
    fullName: string;
    title?: string;
    organization?: string;
    phone1?: string;
    phone2?: string;
    email?: string;
    website?: string;
    profileUrl?: string;
}

export function generateVCard(data: VCardData, isForQR: boolean = false): string {
    const {
        fullName,
        title,
        organization,
        phone1,
        phone2,
        email,
        website,
        profileUrl
    } = data;

    const normalizePhone = (num: string) => {
        const cleaned = num.replace(/\D/g, "");
        if (cleaned.startsWith("0")) return "+66" + cleaned.substring(1);
        return cleaned;
    };

    const lines = [
        "BEGIN:VCARD",
        isForQR ? "VERSION:3.0" : "VERSION:3.0",
    ];

    if (isForQR) {
        // Minimalist version for QR (Easy Scan)
        // Only FN + URL + TEL + NOTE for compact QR that scans reliably on all devices
        lines.push(`FN:${fullName}`);
        if (profileUrl || website) {
            const url = profileUrl || website;
            lines.push(`URL:${url}`);
            // NOTE field as fallback — many Android contact apps skip URL but always import NOTE
            lines.push(`NOTE:${url}`);
        }
        if (phone1) lines.push(`TEL:${normalizePhone(phone1)}`);
    } else {
        // Full version for VCF download
        const nameParts = fullName.trim().split(/\s+/);
        let firstName = fullName;
        let lastName = "";
        if (nameParts.length > 1) {
            lastName = nameParts[nameParts.length - 1];
            firstName = nameParts.slice(0, -1).join(" ");
        }
        lines.push(`N:${lastName};${firstName};;;`);
        lines.push(`FN:${fullName}`);
        if (profileUrl || website) lines.push(`URL;type=pref:${profileUrl || website}`);
        if (phone1) lines.push(`TEL;TYPE=CELL;TYPE=PREF:${normalizePhone(phone1)}`);
        if (phone2) lines.push(`TEL;TYPE=WORK:${normalizePhone(phone2)}`);
        if (email) lines.push(`EMAIL;TYPE=WORK;TYPE=INTERNET:${email}`);
        if (organization) lines.push(`ORG:${organization}`);
        if (title) lines.push(`TITLE:${title}`);
    }

    lines.push("END:VCARD");

    return lines.join("\r\n");
}
