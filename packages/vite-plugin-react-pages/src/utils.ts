import debug from 'debug'
import { PLUGIN_NAME } from './constants'

export const __debug_param = debug(`${PLUGIN_NAME}:param`)
export const __debug_info = debug(`${PLUGIN_NAME}:info`)
