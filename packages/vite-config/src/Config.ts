import { ImportMetaEnv } from './types'

export class Config {
  public readonly env: ImportMetaEnv

  public constructor(env: ImportMetaEnv) {
    this.env = env
  }

  public isDevelopment(): boolean {
    return this.env.DEV
  }

  public isProduction(): boolean {
    return this.env.PROD
  }

  public isServerSideRendering(): boolean {
    return this.env.SSR
  }

  public getBaseUrl(): string {
    return this.env.BASE_URL
  }

  public getMode(): string {
    return this.env.MODE
  }

  public isModeEqualTo(mode: string): boolean {
    return this.env.MODE === mode
  }

  public get(key: string): any {
    return this.env[key]
  }
}
