import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ org: string; slug: string }>;
}

export default async function ProfileRedirectPage({ params }: PageProps) {
    const { org, slug } = await params;

    // Discover if the visited URL was an old-format URL with a language suffix
    const match = slug.match(/-(th|en|ch|jp|lo|hi|fr|it|es|de|ru|fa|pt|br|vi|my|ph|id)$/i);

    if (match) {
        const langCode = match[1].toLowerCase();
        // Strip the trailing suffix to get the pure base slug
        const baseSlug = slug.replace(new RegExp(`-${langCode}$`, 'i'), '');
        // Redirect to the new semantic path
        redirect(`/${org}/${baseSlug}/${langCode}`);
    } else {
        // If no suffix was provided, assume Thai as the default entry point
        redirect(`/${org}/${slug}/th`);
    }
}
