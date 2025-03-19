import { Client, GatewayIntentBits } from 'discord.js';

const token = process.env.TOKEN || '';

const client = new Client({
  intents: GatewayIntentBits.MessageContent,
});

await client.login(token);
