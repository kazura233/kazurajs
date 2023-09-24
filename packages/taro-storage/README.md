[npm]: https://img.shields.io/npm/v/@kazura/taro-storage
[npm-url]: https://www.npmjs.com/package/@kazura/taro-storage
[size]: https://packagephobia.now.sh/badge?p=@kazura/taro-storage
[size-url]: https://packagephobia.now.sh/result?p=@kazura/taro-storage
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/taro-storage

taro storage

## Install

```sh
pnpm i @kazura/web-storage @kazura/taro-storage
```

## Usage

```javascript
import WebStorage from '@kazura/web-storage'
import taroStorage from '@kazura/taro-storage'

const storage = new WebStorage(taroStorage, 'STORAGE_DEMO', String)

storage.setItem('demo')

storage.getItem()

storage.removeItem()

storage.clear()
```

## Author

👤 **kazura233**

- Website: https://github.com/kazura233
- Github: [@kazura233](https://github.com/kazura233)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kazura233/kazurajs/issues).

## Show your support

Give a ⭐️ if this project helped you!
