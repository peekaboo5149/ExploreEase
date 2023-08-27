import { Module } from '@nestjs/common'

@Module({
  imports: [EncryptionModule],
  exports: [EncryptionModule],
})
export class EncryptionModule {}
