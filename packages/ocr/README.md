[npm]: https://img.shields.io/npm/v/@kazura/ocr
[npm-url]: https://www.npmjs.com/package/@kazura/ocr
[size]: https://packagephobia.now.sh/badge?p=@kazura/ocr
[size-url]: https://packagephobia.now.sh/result?p=@kazura/ocr
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/ocr

基于 [ddddocr-node](https://www.npmjs.com/package/ddddocr-node) 的 Node.js OCR 封装，提供图像文字识别（classification）与目标检测（detection），并导出模型类型与字符集范围常量以便类型安全使用。

## 特性

- 封装 `DdddOcr`，可通过 `Ocr.create()` 快速创建实例
- 导出 `MODEL_TYPE`、`CHARSET_RANGE`，与上游枚举一致
- TypeScript 类型友好
- 支持自定义模型目录、OCR 模式、字符范围与 ONNX 日志级别

## 安装

```bash
npm install @kazura/ocr
```

需要 **Node.js ≥ 22.20**（见 `package.json` 中的 `engines`）。

## 使用方法

### 基础：识别图片文字

```typescript
import { Ocr } from '@kazura/ocr'

const ocr = Ocr.create()
const text = await ocr.classification('/path/to/image.png')
console.log(text)
```

### 切换模型与字符范围

```typescript
import { Ocr, MODEL_TYPE, CHARSET_RANGE } from '@kazura/ocr'

const ocr = Ocr.create()
  .setOcrMode(MODEL_TYPE.OCR_BETA)
  .setRanges(CHARSET_RANGE.NUMBER) // 或自定义字符串，限定识别字符集

const text = await ocr.classification('/path/to/captcha.png')
```

### 检测：获取边界框

```typescript
import { Ocr } from '@kazura/ocr'

const ocr = Ocr.create()
const boxes = await ocr.detection('/path/to/image.png')
// number[][] — 检测结果坐标，具体含义见 ddddocr-node 文档
```

### 自定义 ONNX 模型目录与调试

```typescript
import { Ocr } from '@kazura/ocr'

const ocr = Ocr.create()
  .setPath('/path/to/onnx/models')
  .enableDebug()

await ocr.classification('/path/to/image.png')
```

## API 参考

### Ocr

继承自 `ddddocr-node` 的 `DdddOcr`，并附加以下静态成员：

```typescript
class Ocr extends DdddOcr {
  static MODEL_TYPE: typeof MODEL_TYPE
  static CHARSET_RANGE: typeof CHARSET_RANGE
  static create(): Ocr
}
```

实例方法（与上游一致，链式调用返回 `this`）：

| 方法 | 说明 |
| --- | --- |
| `setPath(root: string)` | 设置 ONNX 模型根目录 |
| `setOcrMode(mode: MODEL_TYPE)` | 使用 `MODEL_TYPE.OCR` 或 `MODEL_TYPE.OCR_BETA` |
| `setRanges(charsetRange: CHARSET_RANGE \| string)` | 限制输出字符集；字符串表示允许出现的每个字符 |
| `setLogSeverityLevel(level)` | ONNX Runtime 日志级别 |
| `enableDebug()` | 开启调试（含调试目录准备） |
| `classification(url: string)` | 对图片做 OCR，返回识别文本 `Promise<string>` |
| `detection(url: string)` | 目标检测，返回 `Promise<number[][]>` |

路径 `url` 一般为本地图片文件的绝对或相对路径（与 `ddddocr-node` 行为一致）。

### MODEL_TYPE

```typescript
enum MODEL_TYPE {
  OCR = 0,
  OCR_BETA = 1,
}
```

### CHARSET_RANGE

与 `ddddocr-node` / ddddocr 一致的字符集枚举；详细取值见上游 [CHARSET_RANGE 说明](https://renhaoyeh.github.io/ddddocr-core/enums/CHARSET_RANGE.html)。

## 注意事项

1. 实际推理依赖 `ddddocr-node` 与本机 ONNX 运行环境，首次使用请确认依赖安装与模型文件可用。
2. `classification` / `detection` 为异步方法，需 `await`。
3. 复杂场景（验证码、仅数字等）建议配合 `setRanges` 缩小字符集以提高准确率。

## 仓库与问题反馈

- 源码与说明：[packages/ocr](https://github.com/kazura233/kazurajs/tree/master/packages/ocr)
- Issue：[kazurajs issues](https://github.com/kazura233/kazurajs/issues)

## 许可证

MIT

## Author

👤 **kazura233**

- Website: https://github.com/kazura233
- Github: [@kazura233](https://github.com/kazura233)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kazura233/kazurajs/issues).

## Show your support

Give a ⭐️ if this project helped you!
