import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import winston from 'winston';

// Constants
const LOG_LEVEL = 'info';
const LOG_FORMAT = winston.format.json();

// Get environment variables
const { LOGTAIL_TOKEN, LOGTAIL_HOST } = process.env;

// Create console transport configuration
const winstonTransports = new winston.transports.Console({
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
});

// Create an array of transports
const transports: winston.transport[] = [winstonTransports];

// Only add Logtail client if secrets are available
if (LOGTAIL_TOKEN && LOGTAIL_HOST) {
  const logtail = new Logtail(LOGTAIL_TOKEN, {
    endpoint: `https://${LOGTAIL_HOST}`,
    retryCount: 3, // Number of retries for failed requests
  });
  transports.push(new LogtailTransport(logtail));
}

// Create Winston logger instance
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: LOG_FORMAT,
  transports: transports,
  // Handle uncaught exceptions
  exceptionHandlers: [winstonTransports],
  // Handle unhandled rejections
  rejectionHandlers: [winstonTransports],
});

if (LOGTAIL_TOKEN && LOGTAIL_HOST) {
  logger.info('Logtail is configured and ready to use.');
}

// Export logger instance
export default logger;
