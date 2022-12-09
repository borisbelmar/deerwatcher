import fs from 'fs/promises'
import { CONFIG_FILE_PATH } from './constants'
import { ConfigPackage } from './utils/getLocalPackages'

export type ConfigPackages = Record<string, string | ConfigPackage>

export interface Config {
  packages: ConfigPackages
  command?: string
}

const getConfig = async (): Promise<Config | undefined> => {
  try {
    await fs.access(CONFIG_FILE_PATH)
  } catch (e) {
    return undefined
  }

  const configFileStr = await fs.readFile(CONFIG_FILE_PATH, { encoding: 'utf-8' })
  return JSON.parse(configFileStr)
}

export default getConfig
