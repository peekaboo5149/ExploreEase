import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from 'prisma/prisma.module'
import { EncryptionModule } from '@services/encryption/encryption.module'
import { EncryptionService } from '@services/encryption/encryption.service'

@Module({
  imports: [AuthModule, PrismaModule, EncryptionModule],
  providers: [EncryptionService],
})
export class AppModule {}
