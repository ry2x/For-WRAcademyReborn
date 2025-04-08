import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import winston from 'winston';

// Constants
const LOG_LEVEL = 'info';
const LOG_FORMAT = winston.format.json();

// Get environment variables
const { LOGTAIL_TOKEN, LOGTAIL_HOST } = process.env;

// Validate environment variables
if (!LOGTAIL_TOKEN) {
  throw new Error('LOGTAIL_TOKEN is not defined in environment variables');
}

if (!LOGTAIL_HOST) {
  throw new Error('LOGTAIL_HOST is not defined in environment variables');
}

// Configure Logtail client
const logtail = new Logtail(LOGTAIL_TOKEN, {
  endpoint: `https://${LOGTAIL_HOST}`,
  retryCount: 3, // Number of retries for failed requests
});

// Create Winston logger instance
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: LOG_FORMAT,
  transports: [
    // Logtail transport for cloud logging
    new LogtailTransport(logtail),
    // Console transport for local development
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
  // Handle unhandled rejections
  rejectionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
});

// Export logger instance
export default logger;
