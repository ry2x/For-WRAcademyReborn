import type { ErrorContext, ErrorRecoveryStrategy } from '@/types/error.js';

/**
 * Base error class for all custom errors in the application
 */
export class BaseError extends Error {
  constructor(
    message: string,
    public readonly context: ErrorContext,
    public readonly recovery?: ErrorRecoveryStrategy,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Returns a structured object for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Error thrown when Discord API related operations fail
 */
export class DiscordError extends BaseError {
  constructor(
    message: string,
    context: Omit<ErrorContext, 'severity'>,
    causedBy?: Error,
  ) {
    super(message, { ...context, severity: 'ERROR' });
    if (causedBy) {
      this.cause = causedBy;
    }
  }
}

/**
 * Error thrown when database operations fail
 */
export class DatabaseError extends BaseError {
  constructor(
    message: string,
    context: Omit<ErrorContext, 'severity'>,
    causedBy?: Error,
    recovery?: ErrorRecoveryStrategy,
  ) {
    super(message, { ...context, severity: 'ERROR' }, recovery);
    if (causedBy) {
      this.cause = causedBy;
    }
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends BaseError {
  constructor(
    message: string,
    context: Omit<ErrorContext, 'severity'>,
    public readonly validationErrors: Record<string, string[]>,
  ) {
    super(message, { ...context, severity: 'WARNING' });
    this.context.metadata = {
      ...this.context.metadata,
      validationErrors,
    };
  }
}

/**
 * Error thrown when external API calls fail
 */
export class APIError extends BaseError {
  constructor(
    message: string,
    context: Omit<ErrorContext, 'severity'>,
    public readonly statusCode?: number,
    causedBy?: Error,
  ) {
    super(message, { ...context, severity: 'ERROR' });
    if (statusCode) {
      this.context.metadata = {
        ...this.context.metadata,
        statusCode,
      };
    }
    if (causedBy) {
      this.cause = causedBy;
    }
  }
}
