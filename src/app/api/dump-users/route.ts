import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const orgs = await prisma.organization.findMany({
            select: { id: true, slug: true, name: true, userId: true }
        });
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true }
        });

        return NextResponse.json({ orgs, users });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
