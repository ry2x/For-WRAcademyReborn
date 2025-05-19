import type { ErrorContext } from '@/types/error.js';
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
  try {
    if (error instanceof BaseError) {
      void errorHandler.handle(error);
      return;
    }

    // Convert Error objects to include stack trace
    if (error instanceof Error) {
      const baseError = new BaseError(
        error.message || context,
        ErrorHandler.createContext({
          metadata: {
            originalError: error,
            stack: error.stack,
          },
        }),
      );
      baseError.stack = error.stack;
      void errorHandler.handle(baseError);
      return;
    }

    // Handle other types of errors
    void errorHandler.handle(
      new BaseError(
        context,
        ErrorHandler.createContext({
          severity: 'ERROR',
          metadata: { originalError: error },
        }),
      ),
    );
  } catch (handlingError) {
    // Fallback error handling to prevent recursion
    console.error('Error handling failed:', handlingError);
  }
}

/**
 * Sends a notification message to the admin webhook if configured
 *
 * @param {string} message - The message to send to the admin webhook
 * @param {string} severity - Optional severity level for the message (defaults to INFO)
 * @throws Will log an error if webhook sending fails
 */
export async function notifyAdminWebhook(
  message: string,
  severity: ErrorContext['severity'] = 'INFO',
): Promise<void> {
  const errorHandler = ErrorHandler.getInstance();
  try {
    const context = ErrorHandler.createContext({
      severity,
      metadata: {
        message,
        notificationType: 'admin-webhook',
      },
    });
    const notification = new BaseError(message, context);
    await errorHandler.handle(notification);
  } catch (error) {
    // Prevent recursive error handling
    console.error('Failed to send admin webhook notification:', error);
  }
}

import { interactionError } from '@/embeds/errorEmbed.js';
import { type ChatInputCommandInteraction } from 'discord.js';

/**
 * Safely sends an error message to a Discord interaction
 * This helper ensures we handle both deferred and non-deferred interactions correctly
 */
export async function sendErrorToInteraction(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  if (interaction.deferred || interaction.replied) {
    await interaction.followUp(interactionError);
  } else {
    await interaction.reply(interactionError);
  }
}
