import { DdddOcr, CHARSET_RANGE, MODEL_TYPE } from 'ddddocr-node'

export class Ocr extends DdddOcr {
  public static MODEL_TYPE = MODEL_TYPE
  public static CHARSET_RANGE = CHARSET_RANGE
  public static create(): Ocr {
    return new Ocr()
  }
}
