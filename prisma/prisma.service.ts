import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger: Logger = new Logger(PrismaService.name)

  async onModuleInit() {
    await this.$connect()
  }

  // TODO: Need Refactoring and logic enhancment
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      this.logger.log('Running shut down hook...')
      app.close()
    })
  }
}
