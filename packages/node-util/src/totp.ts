import {
  Totp as __Totp,
  generateConfig,
  ValidTotpConfig,
  generateSecret as generateTotpSecret,
  generateUrl as generateTotpUrl,
  TotpConfig,
} from 'time2fa'

export class TotpBase {
  public readonly config: ValidTotpConfig

  public constructor(config?: TotpConfig) {
    this.config = generateConfig(config)
  }

  public generateSecret(): string {
    return generateTotpSecret(this.config.secretSize)
  }

  public generatePasscodes(secret: string): string {
    const backupCodes = __Totp.generatePasscodes({ secret }, this.config)
    return backupCodes[0]
  }

  public validate(passcode: string, secret: string): boolean {
    return __Totp.validate({ passcode, secret }, this.config)
  }

  public generateUrl(issuer: string, user: string, secret: string): string {
    return generateTotpUrl({ issuer, user, secret }, this.config)
  }
}

export const Totp = new TotpBase()
