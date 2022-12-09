import path from 'path'

export const LOCAL_DEPENDENCIES_PATH = 'node_modules'
export const CONFIG_FILE_NAME = '.deerwatcher.json'
export const CONFIG_FILE_PATH = path.join(process.cwd(), CONFIG_FILE_NAME)
