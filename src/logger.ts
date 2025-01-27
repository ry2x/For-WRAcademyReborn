import { pino } from 'pino';

const logger = pino({
  level: 'trace',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export default logger;
