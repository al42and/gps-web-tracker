const winston = require('winston');
const { createLogger, format, transports } = winston;

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat()
  ),
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({
      filename: __dirname + '/debug.log',
      level: 'debug'
    })
  ],
  exitOnError: false
});

module.exports = logger;
