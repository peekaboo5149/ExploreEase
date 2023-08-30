import { Module, Logger } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from 'prisma/prisma.module'
import { EncryptionModule } from '@services/encryption/encryption.module'
import { EncryptionService } from '@services/encryption/encryption.service'
import { WinstonLoggerService } from '@common/logger/winston.service'
import { FeaturesModule } from './features/features.module';

@Module({
    imports: [AuthModule, PrismaModule, EncryptionModule, FeaturesModule],
    providers: [
        {
            provide: Logger,
            useClass: WinstonLoggerService,
        },
        EncryptionService,
    ],
})
export class AppModule {}
