import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import winston from 'winston';

const { LOGTAIL_TOKEN, LOGTAIL_HOST } = process.env;

const logtail = new Logtail(LOGTAIL_TOKEN || '', {
  endpoint: `https://${LOGTAIL_HOST}`,
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new LogtailTransport(logtail), new winston.transports.Console()],
});

export default logger;
