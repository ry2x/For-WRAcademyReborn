import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import winston from 'winston';

const { LOGTAIL_TOKEN } = process.env;

const logtail = new Logtail(LOGTAIL_TOKEN || '');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new LogtailTransport(logtail), // Logtail へ送信
    new winston.transports.Console(), // コンソール出力
  ],
});

export default logger;
