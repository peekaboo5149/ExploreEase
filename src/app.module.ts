import { Module, Logger } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from 'prisma/prisma.module'
import { EncryptionModule } from '@services/encryption/encryption.module'
import { EncryptionService } from '@services/encryption/encryption.service'
import { WinstonLoggerService } from '@common/logger/winston.service'

@Module({
  imports: [AuthModule, PrismaModule, EncryptionModule],
  providers: [
    {
      provide: Logger,
      useClass: WinstonLoggerService,
    },
    EncryptionService,
  ],
})
export class AppModule {}
