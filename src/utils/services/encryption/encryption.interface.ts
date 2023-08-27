export default interface Encryption {
  encrypt(text: string): Promise<string> | string
  decrypt(encryptedText: string): Promise<string> | string
  compare(encryptedText: string, text: string): Promise<boolean> | boolean
}
