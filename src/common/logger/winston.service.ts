import { Injectable, LoggerService } from '@nestjs/common'
import { createLogger, transports, format } from 'winston'
import { utilities as nestWinstonModuleUtilities } from 'nest-winston'

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger

  constructor() {
    this.logger = createLogger({
      level: 'silly', // Set the default log level

      format: format.combine(
        format.timestamp(),
        format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Nest', {
          colors: true,
          prettyPrint: true,
        }),
      ),
      transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: 'logs/server.log' }), // Log to server.log
        new transports.File({
          filename: 'logs/server_output.log',
          level: 'info', // Log only info, warn, and verbose
        }),
        new transports.File({
          filename: 'logs/server_error.log',
          level: 'error', // Log only error and fatal
        }),
      ],
    })
  }

  log(message: string) {
    this.logger.info(message)
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace)
  }

  warn(message: string) {
    this.logger.warn(message)
  }

  debug(message: string) {
    this.logger.debug(message)
  }

  verbose(message: string) {
    this.logger.verbose(message)
  }
}
