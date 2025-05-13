import type { ErrorContext } from './error.js';

/**
 * Represents a notification channel configuration
 */
export interface NotificationChannel {
  webhookUrl: string;
  name: string;
  severity: ErrorContext['severity'][];
  format?: (error: Error, context: ErrorContext) => string;
  batchSize?: number;
  batchInterval?: number;
}

/**
 * Configuration for notification batching
 */
export interface BatchConfig {
  size: number;
  interval: number; // milliseconds
}

/**
 * Default batch configuration
 */
export const DEFAULT_BATCH_CONFIG: BatchConfig = {
  size: 5,
  interval: 5000, // 5 seconds
};

/**
 * Types of notification channels
 */
export type NotificationChannelType = 'discord' | 'custom';
