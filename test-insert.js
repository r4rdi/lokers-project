process.loadEnvFile('.env.local');
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

https.get('https://jobicy.com/api/v2/remote-jobs?count=2&industry=engineering', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', async () => {
    try {
      const data = JSON.parse(body);
      const apiJobs = data.jobs || [];
      
      const formattedJobs = apiJobs.map((job) => ({
        title: job.jobTitle,
        company_name: job.companyName,
        company_logo_url: job.companyLogo,
        location: job.jobGeo || 'Remote',
        job_type: 'remote', 
        description: job.jobDescription || 'Tidak ada deskripsi rinci.',
        apply_url: job.url,
        source: 'linkedin', 
        source_id: `jobicy-${job.id}`,
        salary_currency: 'USD',
        is_active: true,
        posted_date: new Date(job.pubDate).toISOString(),
      }));

      console.log('Inserting', formattedJobs.length, 'jobs');
      // DO NOT USE ignoreDuplicates so we can see the exact error if it fails!
      const result = await supabase.from('jobs').upsert(formattedJobs, { onConflict: 'source,source_id' }).select();
      
      console.log('Data length:', result.data ? result.data.length : 0);
      console.log('Error:', result.error);
    } catch(e) {
      console.error(e);
    }
  });
});
