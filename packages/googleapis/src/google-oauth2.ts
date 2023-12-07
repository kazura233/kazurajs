import {
  OAuth2Client,
  OAuth2ClientOptions,
  GenerateAuthUrlOpts,
  GetTokenOptions,
} from 'google-auth-library'
import { oauth2, oauth2_v2 } from '@googleapis/oauth2'

export { OAuth2Client, OAuth2ClientOptions, GenerateAuthUrlOpts, GetTokenOptions }

export type UserInfo = oauth2_v2.Schema$Userinfo

export class GoogleOAuth2 {
  public readonly client: OAuth2Client
  constructor(public readonly options: OAuth2ClientOptions) {
    this.client = new OAuth2Client(this.options)
  }

  generateAuthUrl(opts?: GenerateAuthUrlOpts): string {
    return this.client.generateAuthUrl(opts)
  }

  async getUserInfo(options: GetTokenOptions): Promise<UserInfo> {
    const { tokens } = await this.client.getToken(options)
    this.client.setCredentials(tokens)
    const { data } = await oauth2({
      auth: this.client,
      version: 'v2',
    }).userinfo.get()

    return data
  }
}
