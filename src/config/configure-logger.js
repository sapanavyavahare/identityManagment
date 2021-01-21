const { info } = require('winston');
const winston = require('winston');

const myformat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.align(),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message} `
    )
);
const mySecondFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
    winston.format.metadata({
        fillExcept: ['message', 'level', 'timestamp'],
    })
);

const logger = {
    infoLog: winston.createLogger({
        level: 'info',
        format: winston.format.metadata({
            fillExcept: ['message', 'level', 'timestamp'],
        }),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(myformat),
            }),
            new winston.transports.File({
                filename: 'logs/combined.log',
                format: winston.format.combine(mySecondFormat),
            }),
        ],
    }),
    errorLog: winston.createLogger({
        level: 'error',
        transports: [
            new winston.transports.Console({
                format: myformat,
            }),
            new winston.transports.File({
                filename: 'logs/error.log',
                format: mySecondFormat,
            }),
        ],
    }),
};

// logger.info('Information message');
module.exports = logger;
