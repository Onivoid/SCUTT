import winston from 'winston';
import path from 'path';
import { app } from 'electron';
import { format } from 'date-fns';

const logPath = path.join(app.getPath('userData'), 'Logs');

const formatedDate = format(new Date(), 'yyyy-MM-dd-');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logPath, `${formatedDate}error.log`), level: 'error' }),
    new winston.transports.File({ filename: path.join(logPath, `${formatedDate}combined.log`) })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;