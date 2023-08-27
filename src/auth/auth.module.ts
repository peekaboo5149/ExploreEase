import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { EncryptionModule } from '@services/encryption/encryption.module'
import { EncryptionService } from '@services/encryption/encryption.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtSecret } from '@common/constants'
import { APP_GUARD } from '@nestjs/core'
import AuthGuard from './auth.guard'
import { RedisModule } from '@common/cache/redis.module'

@Module({
  imports: [
    RedisModule,
    EncryptionModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EncryptionService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
