import * as winston from 'winston'

const Logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.timestamp()),
})

export default Logger
