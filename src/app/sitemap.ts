import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published profiles
  const profiles = await prisma.profile.findMany({
    where: {
      isPublished: true,
    },
    include: {
      organization: true,
    },
  });

  const baseUrl = 'https://www.ceoprofile.site';

  const profileUrls = profiles.map((profile) => ({
    url: `${baseUrl}/${profile.organization.slug}/${profile.slug}`,
    lastModified: profile.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...profileUrls,
  ]
}
