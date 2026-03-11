import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const trans = await prisma.profileTranslation.findMany({
            where: { lang: "th" },
            include: {
                profile: {
                    include: {
                        organization: true
                    }
                }
            }
        });

        return NextResponse.json(trans);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
