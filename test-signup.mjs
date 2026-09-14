import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://mnvuqdaegtbazofzpmkw.supabase.co/rest/v1/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udnVxZGFlZ3RiYXpvZnpwbWt3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYzMzY2MSwiZXhwIjoyMTAzMjA5NjYxfQ.D-MUk2Eg9Up3Qjz8JTxN4wd8sIgeGIkYqIrXy0i2yVU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfilesInsert() {
  console.log('Testing insert into profiles table...');
  const fakeId = '00000000-0000-0000-0000-000000000001'; // Not in auth.users, will fail FK constraint

  const { error } = await supabase.from('profiles').insert({
    id: fakeId,
    email: 'test@example.com',
    full_name: 'Test',
    role: 'job_seeker'
  });

  if (error) {
    console.error('Error inserting profile:', error.message, error.details, error.hint);
  } else {
    console.log('Insert success');
  }
}

testProfilesInsert();
