const winston = require('winston');
const path = require('path');
const { app } = require('electron');

const logPath = path.join(app.getPath('userData'), 'Logs');

const date = new Date(Date.now());
const formatedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-`;

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
