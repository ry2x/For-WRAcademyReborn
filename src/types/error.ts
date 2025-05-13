/**
 * Severity levels for error handling
 */
export type ErrorSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

/**
 * Error recovery strategy configuration
 */
export interface ErrorRecoveryStrategy {
  shouldRetry: boolean;
  maxRetries: number;
  backoffStrategy: 'fixed' | 'exponential';
  fallbackAction?: () => Promise<void>;
}

/**
 * Context information for error handling
 */
export interface ErrorContext {
  timestamp: Date;
  severity: ErrorSeverity;
  userId?: string;
  guildId?: string;
  command?: string;
  metadata?: Record<string, unknown>;
}
