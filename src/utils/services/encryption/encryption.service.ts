import { Injectable } from '@nestjs/common'
import Encryption from './encryption.interface'
import * as bcrypt from 'bcrypt'

@Injectable()
export class EncryptionService implements Encryption {
  private readonly salt = 10
  async encrypt(text: string): Promise<string> {
    return bcrypt.hash(text, this.salt)
  }
  decrypt(_ignored: string): Promise<string> {
    throw new Error('Method not implemented.') // In Bcrypt library this function doesn't exist
  }
  async compare(encryptedText: string, text: string): Promise<boolean> {
    return bcrypt.compare(encryptedText, text)
  }
}
