// src/lib/vcard.ts

export interface VCardData {
    fullName: string;
    title?: string;
    organization?: string;
    phone1?: string;
    phone2?: string;
    email?: string;
    website?: string;
    profileUrl?: string;
    photoBase64?: string;
    photoType?: string;
    photoUrl?: string;
    note?: string;
}

/**
 * Generate MECARD string for QR codes.
 * MECARD is specifically designed for QR code scanning and is natively
 * supported by Google Lens, Samsung Camera, iOS Camera, etc.
 * Unlike vCard in QR codes, MECARD reliably triggers the "Add Contact" action.
 */
export function generateMeCard(data: VCardData): string {
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

    const normalizePhone = (num: any) => {
        if (!num) return "";
        const cleaned = String(num).replace(/\D/g, "");
        if (cleaned.startsWith("0")) return "+66" + cleaned.substring(1);
        return cleaned;
    };

    // MECARD format: MECARD:N:Last,First;ORG:Company;TEL:Phone;EMAIL:Email;URL:url;NOTE:note;;
    const safeFullName = String(fullName || "");
    const nameParts = safeFullName.trim().split(/\s+/);
    let firstName = safeFullName;
    let lastName = "";
    if (nameParts.length > 1) {
        lastName = nameParts[nameParts.length - 1];
        firstName = nameParts.slice(0, -1).join(" ");
    }

    const parts: string[] = [];
    parts.push(`N:${lastName},${firstName}`);
    if (organization) parts.push(`ORG:${organization}`);
    if (phone1) parts.push(`TEL:${normalizePhone(phone1)}`);
    if (phone2) parts.push(`TEL:${normalizePhone(phone2)}`);
    if (email) parts.push(`EMAIL:${email}`);
    if (profileUrl || website) parts.push(`URL:${profileUrl || website}`);
    // Put title in NOTE since MECARD doesn't have a TITLE field
    if (title) parts.push(`NOTE:${title}`);

    return `MECARD:${parts.join(";")};;`;
}

/**
 * Generate full vCard 3.0 string for .vcf file download.
 * This format includes all fields and optionally a base64-encoded photo.
 */
export function generateVCard(data: VCardData): string {
    const {
        fullName,
        title,
        organization,
        phone1,
        phone2,
        email,
        website,
        profileUrl,
        photoBase64,
        photoType = "JPEG",
        photoUrl,
        note
    } = data;

    const normalizePhone = (num: any) => {
        if (!num) return "";
        const cleaned = String(num).replace(/\D/g, "");
        if (cleaned.startsWith("0")) return "+66" + cleaned.substring(1);
        return cleaned;
    };

    const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
    ];

    const safeFullName = String(fullName || "");
    const nameParts = safeFullName.trim().split(/\s+/);
    let firstName = safeFullName;
    let lastName = "";
    if (nameParts.length > 1) {
        lastName = nameParts[nameParts.length - 1];
        firstName = nameParts.slice(0, -1).join(" ");
    }

    lines.push(`N:${lastName};${firstName};;;`);
    lines.push(`FN:${fullName}`);
    if (organization) lines.push(`ORG:${organization}`);
    if (title) lines.push(`TITLE:${title}`);
    if (phone1) lines.push(`TEL;TYPE=CELL:${normalizePhone(phone1)}`);
    if (phone2) lines.push(`TEL;TYPE=WORK:${normalizePhone(phone2)}`);
    if (email) lines.push(`EMAIL;TYPE=WORK:${email}`);
    if (profileUrl || website) lines.push(`URL:${profileUrl || website}`);
    if (note) lines.push(`NOTE:${note}`);

    // Photo: embed base64 for file download
    if (photoBase64) {
        const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
        // Fold the base64 string to 74 characters per line (standard vCard folding)
        const foldedBase64 = base64Data.match(/.{1,74}/g)?.join("\r\n ") || base64Data;
        lines.push(`PHOTO;ENCODING=b;TYPE=${photoType}:${foldedBase64}`);
    } else if (photoUrl) {
        lines.push(`PHOTO;VALUE=URI:${photoUrl}`);
    }

    lines.push("END:VCARD");

    return lines.join("\r\n");
}
