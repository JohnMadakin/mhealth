import { createLogger, format, transports } from 'winston';
import { appConfig } from '../config/app.config';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    (appConfig.environment === 'production' 
      ? new transports.File({ filename: 'app.log' }) 
        : new transports.Console())
  ]
});

export default logger;
