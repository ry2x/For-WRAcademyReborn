import { ErrorHandler } from '@/utils/errors/errorHandler.js';
import { BaseError } from '@/utils/errors/errors.js';

/**
 * Logs errors with context information using the logger utility
 *
 * @param {string} context - The context where the error occurred
 * @param {unknown} error - The error object or message to be logged
 */
export function handleError(context: string, error: unknown): void {
  const errorHandler = ErrorHandler.getInstance();
  const baseError =
    error instanceof BaseError
      ? error
      : new BaseError(
          context,
          ErrorHandler.createContext({
            metadata: { originalError: error },
          }),
        );
  void errorHandler.handle(baseError);
}

/**
 * Sends a notification message to the admin webhook if configured
 *
 * @param {string} message - The message to send to the admin webhook
 * @throws Will log an error if webhook sending fails
 */
export async function notifyAdminWebhook(message: string): Promise<void> {
  const errorHandler = ErrorHandler.getInstance();
  try {
    const context = ErrorHandler.createContext({
      severity: 'INFO',
      metadata: { message },
    });
    const notification = new BaseError(message, context);
    await errorHandler.handle(notification);
  } catch (error) {
    handleError('webhook.failed', error);
  }
}
