[npm]: https://img.shields.io/npm/v/@kazura/web-crypto
[npm-url]: https://www.npmjs.com/package/@kazura/web-crypto
[size]: https://packagephobia.now.sh/badge?p=@kazura/web-crypto
[size-url]: https://packagephobia.now.sh/result?p=@kazura/web-crypto
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/web-crypto

web crypto

## Install

```sh
pnpm i @kazura/web-crypto
```

## Usage

```javascript
import { Base64, md5, Rsa1024, Aes128Ecb } from '@kazura/web-crypto'

// md5
md5('plain text')

// base64
const base64Ciphertext = Base64.stringify('plain text')
Base64.parse(base64Ciphertext)

// aes-128-ecb
const aesCiphertext = Aes128Ecb.encrypt('plain text', 'secret key')
Aes128Ecb.decrypt(aesCiphertext, 'secret key')

// rsa-1024
const certificate = Rsa1024.createCertificate()
const rsaCiphertext = Rsa1024.encrypt('plain text', certificate.pubkey)
Rsa1024.decrypt(rsaCiphertext, certificate.privkey)
```

## Author

👤 **kazura233**

- Website: https://github.com/kazura233
- Github: [@kazura233](https://github.com/kazura233)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kazura233/kazurajs/issues).

## Show your support

Give a ⭐️ if this project helped you!
