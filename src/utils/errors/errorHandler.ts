import type { ErrorContext } from '@/types/error.js';
import type { BaseError } from '@/utils/errors/errors.js';
import { NotificationManager } from '@/utils/errors/notificationManager.js';
import logger from '@/utils/logger.js';

/**
 * Error handler implementation for managing error handling across the application
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private notificationManager: NotificationManager;

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
    this.setupNotificationChannels();
  } /**
   * Sets up notification channels based on environment variables
   */
  private setupNotificationChannels(): void {
    const { ADMIN_WEBHOOK } = process.env;

    // Skip notification setup if webhook URL is not configured
    if (!ADMIN_WEBHOOK) {
      return;
    }

    // Critical errors - sent immediately
    this.notificationManager.registerChannel('critical', {
      webhookUrl: ADMIN_WEBHOOK,
      severity: ['CRITICAL'],
      batchSize: 1,
      batchInterval: 0,
    });

    // Regular errors - small batches, quick sending
    this.notificationManager.registerChannel('error', {
      webhookUrl: ADMIN_WEBHOOK,
      severity: ['ERROR'],
      batchSize: 3,
      batchInterval: 3000,
    });

    // Warnings - medium batches
    this.notificationManager.registerChannel('warning', {
      webhookUrl: ADMIN_WEBHOOK,
      severity: ['WARNING'],
      batchSize: 5,
      batchInterval: 5000,
    });

    // Info messages - larger batches, less frequent
    this.notificationManager.registerChannel('info', {
      webhookUrl: ADMIN_WEBHOOK,
      severity: ['INFO'],
      batchSize: 10,
      batchInterval: 10000,
    });
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
   * Handles the error by logging and sending notifications
   */
  public async handle(error: BaseError): Promise<void> {
    this.logError(error);
    this.notificationManager.queueNotification(error);

    if (error.recovery?.shouldRetry) {
      await this.attemptRecovery(error);
    }
  }

  /**
   * Attempts to recover from the error using the provided strategy
   */
  private async attemptRecovery(
    error: BaseError,
    retryCount = 0,
  ): Promise<void> {
    const { recovery } = error;
    if (!recovery || !recovery.shouldRetry) return;

    if (retryCount >= (recovery.maxRetries || 3)) {
      if (recovery.fallbackAction) {
        try {
          await recovery.fallbackAction();
        } catch (fallbackError) {
          this.logError(fallbackError as BaseError);
        }
      }
      return;
    }

    const delay = this.calculateBackoffDelay(
      retryCount,
      recovery.backoffStrategy || 'exponential',
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      if (recovery.fallbackAction) {
        await recovery.fallbackAction();
      }
    } catch (retryError) {
      await this.attemptRecovery(error, retryCount + 1);
    }
  }

  /**
   * Calculates backoff delay based on strategy
   */
  private calculateBackoffDelay(
    retryCount: number,
    strategy: 'fixed' | 'exponential',
  ): number {
    const baseDelay = 1000; // 1 second
    if (strategy === 'fixed') {
      return baseDelay;
    }
    return Math.min(baseDelay * Math.pow(2, retryCount), 30000); // Max 30 seconds
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

  /**
   * Disposes of resources
   */
  public dispose(): void {
    const manager = NotificationManager.getInstance();
    manager.dispose();
  }
}
