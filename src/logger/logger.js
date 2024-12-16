import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, colorize } = format;

// Custom format for log messages
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'silly', // Log all levels
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  format: combine(
    label({ label: 'my-app' }),
    timestamp(),
    colorize(), // Add color coding to log levels
    myFormat,
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'combined.log' }), // Log to file
  ],
});

export default logger;
