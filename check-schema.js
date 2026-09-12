import https from 'https';

const supabaseUrl = 'mnvuqdaegtbazofzpmkw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udnVxZGFlZ3RiYXpvZnpwbWt3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYzMzY2MSwiZXhwIjoyMTAzMjA5NjYxfQ.D-MUk2Eg9Up3Qjz8JTxN4wd8sIgeGIkYqIrXy0i2yVU';

const options = {
  hostname: supabaseUrl,
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  family: 4, 
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const subscriptions = json.definitions?.subscriptions;
      console.log('\nSubscriptions schema:', JSON.stringify(subscriptions?.properties, null, 2));
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.end();
