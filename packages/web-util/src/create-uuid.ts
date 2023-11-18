import { v4 as uuidv4 } from 'uuid'

/**
 * 创建一个 UUID
 * @param namespace - 可选的命名空间
 * @returns - UUID 字符串
 */
export const createUUID = (namespace?: string): string => {
  const uuid = uuidv4()
  return namespace ? `${namespace} [${uuid}]` : uuid
}
