import type {
  BatchConfig,
  NotificationChannel,
  NotificationChannelType,
} from '@/types/notification.js';
import { DEFAULT_BATCH_CONFIG } from '@/types/notification.js';
import type { BaseError } from '@/utils/errors/errors.js';
import { WebhookClient } from 'discord.js';

/**
 * Manages error notifications across different channels
 */
export class NotificationManager {
  private static instance: NotificationManager;
  private channels: Map<string, NotificationChannel>;
  private batchQueues: Map<string, BaseError[]>;
  private batchTimers: Map<string, NodeJS.Timeout>;
  private webhookClients: Map<string, WebhookClient>;

  private constructor() {
    this.channels = new Map();
    this.batchQueues = new Map();
    this.batchTimers = new Map();
    this.webhookClients = new Map();
  }

  /**
   * Gets the singleton instance
   */
  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Registers a new notification channel
   */
  public registerChannel(
    name: string,
    config: Omit<NotificationChannel, 'name'>,
    type: NotificationChannelType = 'discord',
  ): void {
    const channel: NotificationChannel = {
      name,
      ...config,
    };

    this.channels.set(name, channel);

    if (type === 'discord') {
      this.webhookClients.set(
        name,
        new WebhookClient({ url: config.webhookUrl }),
      );
    }

    // Initialize batch queue for this channel
    this.batchQueues.set(name, []);
  }
  /**
   * Queues an error for notification
   */
  public queueNotification(error: BaseError): void {
    // Skip if no channels are configured
    if (this.channels.size === 0) {
      return;
    }

    const { severity } = error.context;

    for (const [name, channel] of this.channels) {
      if (channel.severity.includes(severity)) {
        const queue = this.batchQueues.get(name) || [];
        queue.push(error);
        this.batchQueues.set(name, queue);

        const batchConfig = this.getBatchConfig(channel);
        this.setupBatchProcessing(name, batchConfig);
      }
    }
  }

  /**
   * Gets batch configuration for a channel
   */
  private getBatchConfig(channel: NotificationChannel): BatchConfig {
    return {
      size: channel.batchSize || DEFAULT_BATCH_CONFIG.size,
      interval: channel.batchInterval || DEFAULT_BATCH_CONFIG.interval,
    };
  }

  /**
   * Sets up batch processing for a channel
   */
  private setupBatchProcessing(channelName: string, config: BatchConfig): void {
    const existingTimer = this.batchTimers.get(channelName);
    if (existingTimer) return;

    const timer = setTimeout(() => {
      void this.processBatch(channelName);
    }, config.interval);

    this.batchTimers.set(channelName, timer);
  }

  /**
   * Processes a batch of notifications for a channel
   */
  private async processBatch(channelName: string): Promise<void> {
    const channel = this.channels.get(channelName);
    const queue = this.batchQueues.get(channelName);
    const webhookClient = this.webhookClients.get(channelName);

    if (!channel || !queue || !webhookClient) return;

    try {
      const messages = queue.map((error) =>
        this.formatErrorMessage(error, channel),
      );

      if (messages.length > 0) {
        const content = messages.join('\n\n---\n\n');
        await webhookClient.send({
          content: content.slice(0, 2000), // Discord message length limit
        });
      }
    } catch (error) {
      console.error(`Failed to send notifications to ${channelName}:`, error);
    }

    // Clear the processed batch
    this.batchQueues.set(channelName, []);
    this.batchTimers.delete(channelName);
  }

  /**
   * Formats error message for notification
   */
  private formatErrorMessage(
    error: BaseError,
    channel: NotificationChannel,
  ): string {
    if (channel.format) {
      return channel.format(error, error.context);
    }

    const { context } = error;
    const parts = [
      `**${error.name}**: ${error.message}`,
      `**Severity**: ${context.severity}`,
      context.command && `**Command**: ${context.command}`,
      context.userId && `**User ID**: ${context.userId}`,
      context.guildId && `**Guild ID**: ${context.guildId}`,
      context.metadata &&
        `**Metadata**: \`\`\`json\n${JSON.stringify(
          context.metadata,
          null,
          2,
        )}\`\`\``,
      error.stack && `**Stack**: \`\`\`\n${error.stack}\`\`\``,
    ].filter(Boolean);

    return parts.join('\n');
  }

  /**
   * Cleans up resources
   */
  public dispose(): void {
    for (const timer of this.batchTimers.values()) {
      clearTimeout(timer);
    }
    this.batchTimers.clear();
    this.batchQueues.clear();

    for (const client of this.webhookClients.values()) {
      client.destroy();
    }
    this.webhookClients.clear();
  }
}
