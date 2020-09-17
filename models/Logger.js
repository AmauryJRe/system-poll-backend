const winston = require('winston');
const { transports, format } = winston;
require('dotenv').config();
const errorFile = process.env.ERROFILE
module.exports = class MyLogger {
  constructor() {
    const print = format.printf((info) => {
      const log = `${info.timestamp} ${info.level}: ${info.message}`;
      return info.stack ? `${log}\n${info.stack}` : log;
    });
    this.logger = winston.createLogger({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.errors({ stack: true }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        print,
      ),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: errorFile || './logs/errors.log',
          level: 'error',
          format: format.uncolorize(),
        }),
      ],
    });
  }
};
