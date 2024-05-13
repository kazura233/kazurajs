import { Config } from './Config'

export class ConfigContextHolder {
  private static contextHolder: Config | null = null

  public static getContext() {
    return this.contextHolder
  }

  public static setContext(context: Config) {
    this.contextHolder = context
  }

  public static clearContext() {
    this.contextHolder = null
  }
}
