import { v4 as uuidv4 } from 'uuid'

/**
 * 生产一个UUID
 */
export const createUUID = (namespace?: string): string => {
  const uuid = uuidv4()
  return namespace ? `${namespace} [${uuid}]` : uuid
}
