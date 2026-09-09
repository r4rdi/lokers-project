import fs from 'fs';

const supabaseUrl = 'https://mnvuqdaegtbazofzpmkw.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udnVxZGFlZ3RiYXpvZnpwbWt3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYzMzY2MSwiZXhwIjoyMTAzMjA5NjYxfQ.D-MUk2Eg9Up3Qjz8JTxN4wd8sIgeGIkYqIrXy0i2yVU';

async function fetchSchema() {
  try {
    const response = await fetch(supabaseUrl);
    const data = await response.json();
    
    // Check profiles table definition
    const profiles = data.definitions?.profiles;
    console.log('Profiles table schema:', JSON.stringify(profiles?.properties, null, 2));
    
    // Check subscriptions table definition
    const subscriptions = data.definitions?.subscriptions;
    console.log('\nSubscriptions table schema:', JSON.stringify(subscriptions?.properties, null, 2));
    
  } catch (error) {
    console.error('Error fetching schema:', error);
  }
}

fetchSchema();
