import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { defaultTheme } from "@/components/ThemeProvider";

// GET /api/profile/theme - Retrieve the current user's theme config
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileId = req.nextUrl.searchParams.get("id");

    try {
        let profile;
        if (profileId) {
            profile = await prisma.profile.findFirst({
                where: { id: profileId, organization: { userId: session.user.id } }
            });
        } else {
            const organization = await prisma.organization.findFirst({
                where: { userId: session.user.id },
                include: { profiles: true }
            });
            profile = organization?.profiles?.[0];
        }

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const themeConfig = profile.themeConfig || defaultTheme;
        const mediaConfig = profile.mediaConfig || {};

        return NextResponse.json({ themeConfig, mediaConfig });
    } catch (error) {
        console.error("[API] Error fetching theme:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/profile/theme - Update user's theme config
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { themeConfig, mediaConfig, id: profileId } = body;

        if (!themeConfig && !mediaConfig) {
            return NextResponse.json({ error: "No configuration provided" }, { status: 400 });
        }

        let profile;
        if (profileId) {
            profile = await prisma.profile.findFirst({
                where: { id: profileId, organization: { userId: session.user.id } }
            });
        } else {
            const organization = await prisma.organization.findFirst({
                where: { userId: session.user.id },
                include: { profiles: true }
            });
            profile = organization?.profiles?.[0];
        }

        if (!profile) {
            return NextResponse.json({ error: "Profile not found." }, { status: 404 });
        }

        // Update the Json fields in the database
        const updatedProfile = await prisma.profile.update({
            where: { id: profile.id },
            data: {
                ...(themeConfig !== undefined && { themeConfig }),
                ...(mediaConfig !== undefined && { mediaConfig })
            }
        });

        return NextResponse.json({
            themeConfig: updatedProfile.themeConfig,
            mediaConfig: updatedProfile.mediaConfig
        });
    } catch (error) {
        console.error("[API] Error updating theme:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
