import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const profiles = await prisma.profile.findMany({
            orderBy: { createdAt: 'desc' },
            include: { translations: { select: { lang: true, id: true } }, organization: { select: { slug: true } } },
            take: 20
        });

        return NextResponse.json({
            profiles: profiles.map(p => ({
                id: p.id,
                slug: p.slug,
                orgSlug: p.organization?.slug,
                langs: p.translations.map(t => t.lang),
                createdAt: p.createdAt
            }))
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
