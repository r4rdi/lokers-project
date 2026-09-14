/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');

const supabaseUrl = 'mnvuqdaegtbazofzpmkw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udnVxZGFlZ3RiYXpvZnpwbWt3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYzMzY2MSwiZXhwIjoyMTAzMjA5NjYxfQ.D-MUk2Eg9Up3Qjz8JTxN4wd8sIgeGIkYqIrXy0i2yVU';

const payload = JSON.stringify({
  id: '00000000-0000-0000-0000-000000000001', // Fake UUID
  email: 'test@example.com',
  full_name: 'Test'
});

const options = {
  hostname: supabaseUrl,
  port: 443,
  path: '/rest/v1/profiles',
  method: 'POST',
  family: 4, 
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${data}`);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(payload);
req.end();
