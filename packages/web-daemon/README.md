[npm]: https://img.shields.io/npm/v/@kazura/web-daemon
[npm-url]: https://www.npmjs.com/package/@kazura/web-daemon
[size]: https://packagephobia.now.sh/badge?p=@kazura/web-daemon
[size-url]: https://packagephobia.now.sh/result?p=@kazura/web-daemon
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/web-daemon

web daemon

## Install

```sh
pnpm i @kazura/web-daemon
```

## Usage

```javascript
import WebDaemon from '@kazura/web-daemon'

let point = 1

const daemon = new WebDaemon((next) => {
  console.log(point++)
  next()
})

daemon.start()

daemon.pause()

WebDaemon.pauseAll()
```

## Author

👤 **kazura233**

- Website: https://github.com/kazura233
- Github: [@kazura233](https://github.com/kazura233)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kazura233/kazurajs/issues).

## Show your support

Give a ⭐️ if this project helped you!
