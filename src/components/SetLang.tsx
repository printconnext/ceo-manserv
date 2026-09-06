"use client";

import { useEffect } from "react";

/**
 * Client component that dynamically sets the <html lang> attribute
 * based on the profile's actual translation language.
 *
 * Uses both a synchronous blocking script (for crawlers that execute JS)
 * and useEffect (for client-side navigation). The root layout has
 * suppressHydrationWarning to tolerate the mismatch.
 */
export default function SetLang({ lang }: { lang: string }) {
    useEffect(() => {
        document.documentElement.lang = lang;
        return () => {
            document.documentElement.lang = "en";
        };
    }, [lang]);

    // Blocking inline script sets lang before paint for JS-executing crawlers
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `document.documentElement.lang="${lang}";`,
            }}
        />
    );
}
