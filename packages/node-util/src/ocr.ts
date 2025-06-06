import { DdddOcr, CHARSET_RANGE, MODEL_TYPE } from 'ddddocr-node'
import type { LogSeverityLevel } from 'ddddocr-node/dist/type'

export class Ocr extends DdddOcr {
  public static MODEL_TYPE = MODEL_TYPE
  public static CHARSET_RANGE = CHARSET_RANGE
  public static create(logSeverityLevel?: LogSeverityLevel): Ocr {
    return new Ocr(logSeverityLevel)
  }
}
