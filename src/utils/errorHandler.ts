import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';
import { WebhookClient } from 'discord.js';

/**
 * Logs errors with context information using the logger utility
 *
 * @param {string} context - The context where the error occurred
 * @param {unknown} error - The error object or message to be logged
 */
export function handleError(context: string, error: unknown): void {
  logger.error(`${context}:`, error);
}

/**
 * Sends a notification message to the admin webhook if configured
 *
 * @param {string} message - The message to send to the admin webhook
 * @throws Will log an error if webhook sending fails
 */
export async function notifyAdminWebhook(message: string): Promise<void> {
  const { ADMIN_WEBHOOK } = process.env;
  if (!ADMIN_WEBHOOK) return;

  try {
    const webhook = new WebhookClient({ url: ADMIN_WEBHOOK });
    await webhook.send(message);
  } catch (error) {
    handleError(t('webhook.failed'), error);
  }
}
