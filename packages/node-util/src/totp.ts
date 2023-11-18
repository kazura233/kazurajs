import {
  Totp as __Totp,
  generateConfig,
  ValidTotpConfig,
  generateSecret as generateTotpSecret,
  generateUrl as generateTotpUrl,
} from 'time2fa'

export class Totp {
  public static readonly config: ValidTotpConfig = generateConfig()

  public static generateSecret(): string {
    return generateTotpSecret(Totp.config.secretSize)
  }

  public static generatePasscodes(secret: string): string {
    const backupCodes = __Totp.generatePasscodes({ secret }, Totp.config)
    return backupCodes[0]
  }

  public static validate(passcode: string, secret: string): boolean {
    return __Totp.validate({ passcode, secret }, Totp.config)
  }

  public static generateUrl(issuer: string, user: string, secret: string): string {
    return generateTotpUrl({ issuer, user, secret }, Totp.config)
  }
}
