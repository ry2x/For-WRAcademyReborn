import type { ErrorContext, ErrorRecoveryStrategy } from '@/types/error.js';
import type { BaseError } from '@/utils/errors/errors.js';
import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';
import { WebhookClient } from 'discord.js';

/**
 * Error handler implementation for managing error handling across the application
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private webhookClient?: WebhookClient;

  private constructor() {
    const { ADMIN_WEBHOOK } = process.env;
    if (ADMIN_WEBHOOK) {
      this.webhookClient = new WebhookClient({ url: ADMIN_WEBHOOK });
    }
  }

  /**
   * Gets the singleton instance of ErrorHandler
   */
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Logs the error with context information
   */
  private logError(error: BaseError): void {
    const errorData = error.toJSON();
    logger.error(
      `[${errorData.context.severity}] ${errorData.name}: ${errorData.message}`,
      {
        ...errorData,
        stack: errorData.stack?.split('\n'),
      },
    );
  }

  /**
   * Sends error notification through configured channels
   */
  private async notify(error: BaseError): Promise<void> {
    if (!this.webhookClient) return;

    try {
      const message = this.formatErrorMessage(error);
      await this.webhookClient.send(message);
    } catch (notifyError) {
      logger.error(t('webhook.failed'), notifyError);
    }
  }

  /**
   * Formats error message for notification
   */
  private formatErrorMessage(error: BaseError): string {
    const { context } = error;
    const parts = [
      `**${error.name}**: ${error.message}`,
      `**Severity**: ${context.severity}`,
      context.command && `**Command**: ${context.command}`,
      context.userId && `**User ID**: ${context.userId}`,
      context.guildId && `**Guild ID**: ${context.guildId}`,
      context.metadata &&
        `**Metadata**: \`\`\`json\n${JSON.stringify(context.metadata, null, 2)}\`\`\``,
      error.stack && `**Stack**: \`\`\`\n${error.stack}\`\`\``,
    ].filter(Boolean);

    return parts.join('\n');
  }

  /**
   * Attempts to recover from the error using the provided strategy
   */
  private async attemptRecovery(
    error: BaseError,
    retryCount = 0,
  ): Promise<void> {
    const { recovery } = error;
    if (
      !recovery ||
      !recovery.shouldRetry ||
      retryCount >= recovery.maxRetries
    ) {
      if (recovery?.fallbackAction) {
        await recovery.fallbackAction();
      }
      return;
    }

    const delay = this.calculateBackoff(retryCount, recovery);
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      if (recovery.fallbackAction) {
        await recovery.fallbackAction();
      }
    } catch (retryError) {
      await this.handle(error, retryCount + 1);
    }
  }

  /**
   * Calculates backoff delay based on strategy
   */
  private calculateBackoff(
    retryCount: number,
    recovery: ErrorRecoveryStrategy,
  ): number {
    const baseDelay = 1000; // 1 second
    if (recovery.backoffStrategy === 'fixed') {
      return baseDelay;
    }
    // Exponential backoff: 1s, 2s, 4s, 8s, ...
    return baseDelay * Math.pow(2, retryCount);
  }

  /**
   * Main error handling method
   */
  public async handle(error: BaseError, retryCount = 0): Promise<void> {
    this.logError(error);
    await this.notify(error);

    if (error.recovery?.shouldRetry) {
      await this.attemptRecovery(error, retryCount);
    }
  }

  /**
   * Creates a new error context
   */
  public static createContext(
    partial: Partial<ErrorContext> = {},
  ): ErrorContext {
    return {
      timestamp: new Date(),
      severity: 'ERROR',
      ...partial,
    };
  }
}
