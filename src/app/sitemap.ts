import { MetadataRoute } from 'next';
import { createServerClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lokers.biz.id';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic job routes
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes("placeholder")) {
      const supabase = await createServerClient();
      
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, updated_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1000); // Max 1000 for sitemap

      if (jobs) {
        const jobUrls: MetadataRoute.Sitemap = jobs.map((job) => ({
          url: `${baseUrl}/jobs/${job.id}`,
          lastModified: new Date(job.updated_at),
          changeFrequency: 'daily',
          priority: 0.8,
        }));
        
        return [...routes, ...jobUrls];
      }
    }
  } catch (error) {
    console.error("Error generating sitemap for jobs:", error);
  }

  return routes;
}
