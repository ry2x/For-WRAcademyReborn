import logger from '@/utils/logger.js';
import { WebhookClient } from 'discord.js';

export function handleError(context: string, error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  logger.error(`${context}:`, errorMessage);
}

export async function notifyAdminWebhook(message: string): Promise<void> {
  const { ADMIN_WEBHOOK } = process.env;
  if (!ADMIN_WEBHOOK) return;

  try {
    const webhook = new WebhookClient({ url: ADMIN_WEBHOOK });
    await webhook.send(message);
  } catch (error) {
    handleError('Failed to send webhook notification', error);
  }
}
