import * as winston from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize({ all: true })
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export default logger;