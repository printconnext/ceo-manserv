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

export function generateVCard(data: VCardData): string {
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

    // Split name for N field (Last;First;Middle;Prefix;Suffix)
    const nameParts = fullName.trim().split(/\s+/);
    let firstName = fullName;
    let lastName = "";

    if (nameParts.length > 1) {
        lastName = nameParts[nameParts.length - 1];
        firstName = nameParts.slice(0, -1).join(" ");
    }

    const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName};${firstName};;;`,
        `FN:${fullName}`,
    ];

    if (phone1) lines.push(`TEL;TYPE=CELL;TYPE=PREF:${phone1}`);
    if (phone2) lines.push(`TEL;TYPE=WORK:${phone2}`);
    if (email) lines.push(`EMAIL;TYPE=PREF;TYPE=WORK:${email}`);
    if (organization) lines.push(`ORG;CHARSET=UTF-8:${organization}`);
    if (title) lines.push(`TITLE:${title}`);
    if (profileUrl) lines.push(`URL:${profileUrl}`);
    if (website) lines.push(`URL:${website}`);

    lines.push("END:VCARD");

    return lines.join("\n");
}
