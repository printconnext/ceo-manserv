// src/lib/auth.ts

import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import prisma from "@/lib/prisma";

// Build providers list conditionally based on environment variables
const providers = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        })
    );
}
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    providers.push(
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        })
    );
}

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("[NextAuth] signIn callback:", { user: user?.email, provider: account?.provider });

            // Auto-elevate master account
            if (user?.email === "printconnext@gmail.com") {
                try {
                    await prisma.user.update({
                        where: { email: user.email },
                        data: { plan: "diamond" }
                    });
                } catch (err) {
                    console.error("[NextAuth] Failed to elevate master account:", err);
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.provider = account.provider;
            }
            if (user) {
                token.id = user.id;
                token.plan = (user as any).plan || "free";
            } else if (token.id) {
                // Periodically sync plan from DB if not provided in user object (refresh)
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { plan: true }
                });
                if (dbUser) {
                    token.plan = dbUser.plan || "free";
                }
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.sub || token.id;
                session.user.plan = token.plan || "free";
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // After sign in, redirect to dashboard
            if (url.startsWith(baseUrl)) return url;
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            return `${baseUrl}/dashboard`;
        },
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET || "default-secret",
};

