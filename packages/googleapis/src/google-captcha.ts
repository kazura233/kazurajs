import { createAPIRequest } from 'googleapis-common'

export type VerifyResponseErrorCode =
  | 'missing-input-secret' // The secret parameter is missing.
  | 'invalid-input-secret' // The secret parameter is invalid or malformed.
  | 'missing-input-response' // The response parameter is missing.
  | 'invalid-input-response' // The response parameter is invalid or malformed.
  | 'bad-request' // The request is invalid or malformed.
  | 'timeout-or-duplicate' // The response is no longer valid: either is too old or has been used previously.

export interface VerifyResponse {
  success: boolean
  challenge_ts: string // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  hostname: string // the hostname of the site where the reCAPTCHA was solved
  'error-codes': VerifyResponseErrorCode[] // optional
}

export class GoogleCaptcha {
  constructor(public readonly secret: string) {}

  async verify(token: string, remoteip?: string) {
    // https://developers.google.com/recaptcha/docs/verify
    const resp = await createAPIRequest<VerifyResponse>({
      options: {
        url: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'POST',
      },
      params: {
        secret: this.secret, // Required. The shared key between your site and reCAPTCHA.
        response: token, // The user response token provided by the reCAPTCHA client-side integration on your site.
        remoteip, // Optional. The user's IP address.
      },
      requiredParams: [],
      pathParams: [],
      context: {
        _options: {},
      },
    })

    return resp.data
  }
}
