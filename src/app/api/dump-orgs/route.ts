import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const orgs = await prisma.organization.findMany({
            include: { profiles: { include: { translations: true } } }
        });

        return NextResponse.json(orgs.map(o => ({
            id: o.id,
            slug: o.slug,
            name: o.name,
            profiles: o.profiles.map(p => ({
                id: p.id,
                slug: p.slug,
                langs: p.translations.map(t => t.lang)
            }))
        })));
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
