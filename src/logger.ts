import * as path from 'path'

import dotenv from 'dotenv'
import moment from 'moment-timezone'
import winston from 'winston'

dotenv.config()

enum WinstonLogLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly'
}

const loggerFormat = winston.format.printf(function (info) {
  const timestamp = moment().tz('Europe/Berlin').format('YYYY-MM-DD hh:mm:ss')
  return `[${timestamp}] [${info.level.toUpperCase()}]: ${info.message}`
})

const logDate = new Date()
const transports = []
transports.push(new winston.transports.Console())
if (process.env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.File({
      dirname: path.resolve(process.env.LOG_LOCATION || 'logs'),
      filename: `debug_${logDate.getFullYear()}-${String(`00${logDate.getMonth() + 1}`).slice(-2)}-${String(`00${logDate.getDate()}`).slice(-2)}.log`,
      level: WinstonLogLevel.silly
    })
  )
} else {
  transports.push(
    new winston.transports.File({
      dirname: path.resolve(process.env.LOG_LOCATION || 'logs'),
      filename: `log_${logDate.getFullYear()}-${String(`00${logDate.getMonth() + 1}`).slice(-2)}-${String(`00${logDate.getDate()}`).slice(-2)}.log`
    })
  )
}
transports.push(
  new winston.transports.File({
    dirname: path.resolve(process.env.LOG_LOCATION || 'logs'),
    filename: `error_${logDate.getFullYear()}-${String(`00${logDate.getMonth() + 1}`).slice(-2)}-${String(`00${logDate.getDate()}`).slice(-2)}.log`,
    level: WinstonLogLevel.error
  })
)

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(winston.format.timestamp(), loggerFormat),
  transports: transports
})
