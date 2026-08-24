export function generateMarkdown(content: any, orgName: string, profileName: string): string {
    const lines: string[] = [];

    // Main Header
    lines.push(`# CEO Profile: ${content.heroName || profileName || "CEO"}`);
    if (content.heroRole || content.heroQuote) {
        lines.push(`> ${content.heroRole || content.heroQuote}`);
    }
    lines.push("");

    // Current Position
    if (content.heroTitle || orgName) {
        lines.push(`## 💼 Current Position`);
        lines.push(`${content.heroRole || "Executive"} at **${content.heroTitle || orgName}**`);
        lines.push("");
    }

    // About Section
    if (content.aboutData) {
        const about = content.aboutData;
        lines.push(`## 🎯 Vision & Mission`);
        if (about.visionTitle) {
            lines.push(`### ${about.visionTitle}`);
        }
        if (about.visionDesc1) {
            lines.push(about.visionDesc1);
        }
        if (about.visionDesc2) {
            lines.push("");
            lines.push(about.visionDesc2);
        }
        lines.push("");

        if (about.stats && Array.isArray(about.stats) && about.stats.length > 0) {
            lines.push(`### Key Statistics`);
            about.stats.forEach((stat: any) => {
                if (stat.label || stat.value) {
                    lines.push(`- **${stat.label || "Metric"}**: ${stat.value || ""}`);
                }
            });
            lines.push("");
        }
    }

    // Services / Expertise
    if (content.servicesData?.items && Array.isArray(content.servicesData.items)) {
        const validServices = content.servicesData.items.filter((item: any) => item.title || item.description);
        if (validServices.length > 0) {
            lines.push(`## 🛠️ Expertise & Services`);
            validServices.forEach((service: any) => {
                lines.push(`### ${service.title || "Service"}`);
                if (service.description) {
                    lines.push(service.description);
                }
                lines.push("");
            });
        }
    }

    // Experience
    if (content.experienceData?.items && Array.isArray(content.experienceData.items)) {
        const validExp = content.experienceData.items.filter((item: any) => item.year || item.title || item.description);
        if (validExp.length > 0) {
            lines.push(`## 🏆 Experience & Achievements`);
            validExp.forEach((exp: any) => {
                const year = exp.year ? `**[${exp.year}]** ` : "";
                lines.push(`- ${year}${exp.title || ""}`);
                if (exp.description) {
                    lines.push(`  - *${exp.description}*`);
                }
            });
            lines.push("");
        }
    }

    // Clients & Partners
    if (content.clientsData?.items && Array.isArray(content.clientsData.items)) {
        const validClients = content.clientsData.items.filter((c: any) => c.name);
        if (validClients.length > 0) {
            lines.push(`## 🤝 Key Clients & Partners`);
            const clientNames = validClients.map((c: any) => c.name).join(", ");
            lines.push(clientNames);
            lines.push("");
        }
    }

    // Looking For / Collaboration
    if (content.clientsData?.lookingForDesc || (content.clientsData?.lookingForItems && content.clientsData.lookingForItems.length > 0)) {
        lines.push(`## 💡 Looking For (Cooperation & Opportunities)`);
        if (content.clientsData.lookingForDesc) {
            lines.push(content.clientsData.lookingForDesc);
            lines.push("");
        }
        if (content.clientsData.lookingForItems && Array.isArray(content.clientsData.lookingForItems)) {
            const validItems = content.clientsData.lookingForItems.filter((item: any) => item.title || item.description);
            validItems.forEach((item: any) => {
                lines.push(`### ${item.title || "Opportunity"}`);
                if (item.description) {
                    lines.push(item.description);
                }
                lines.push("");
            });
        }
    }

    // Contact Info
    if (content.contactData) {
        lines.push(`## 📞 Contact Information`);
        if (content.contactData.mobile) {
            lines.push(`- **Mobile**: ${content.contactData.mobile}`);
        }
        if (content.contactData.officePhone || content.contactData.office) {
            lines.push(`- **Office Phone**: ${content.contactData.officePhone || content.contactData.office}`);
        }
        if (content.contactData.email) {
            lines.push(`- **Email**: ${content.contactData.email}`);
        }
        const website = content.contactData.website || content.contactData.websiteValue;
        if (website) {
            lines.push(`- **Website**: ${website}`);
        }
        if (content.contactData.websites && Array.isArray(content.contactData.websites) && content.contactData.websites.length > 0) {
            content.contactData.websites.forEach((w: string) => {
                lines.push(`- **Additional Website**: ${w}`);
            });
        }
        lines.push("");
    }

    lines.push(`---`);
    lines.push(`*Generated from ceoprofile.site*`);

    return lines.join("\n");
}
