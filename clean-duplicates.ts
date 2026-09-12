import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

// simple dotenv parse since package might not be installed globally
const envFile = readFileSync('.env.local', 'utf-8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function clean() {
  console.log('Cleaning up duplicates...');
  // Find all jobs
  const { data: jobs, error } = await supabase.from('jobs').select('id, source_id, title, company_name');
  if (error) throw error;

  console.log(`Found ${jobs.length} total jobs.`);
  
  const seen = new Set();
  const toDelete = [];
  
  for (const job of jobs) {
    const slug = `${job.company_name}-${job.title}`.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, '-');
    if (seen.has(slug)) {
      toDelete.push(job.id);
    } else {
      seen.add(slug);
    }
  }

  console.log(`Found ${toDelete.length} duplicates to delete.`);
  
  if (toDelete.length > 0) {
    // Delete in chunks of 50
    for (let i = 0; i < toDelete.length; i += 50) {
      const chunk = toDelete.slice(i, i + 50);
      const { error: delErr } = await supabase.from('jobs').delete().in('id', chunk);
      if (delErr) {
        console.error('Delete error:', delErr);
      } else {
        console.log(`Deleted batch of ${chunk.length}`);
      }
    }
  }
  
  console.log('Done cleaning!');
}

clean().catch(console.error);
