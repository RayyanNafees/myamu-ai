import Cloudflare from 'cloudflare';

const client = new Cloudflare({
  apiEmail: 'nafees.rayyan@gmail.com', // This is the default and can be omitted
  apiKey: process.env.R2_AUTH_TOKEN, // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const durableObject of client.durableObjects.namespaces.objects.list(
  '5fd1cafff895419c8bcc647fc64ab8f0',
  { account_id: process.env.R2_ACCOUNT_ID as string },
)) {
  console.log(durableObject.id);
}