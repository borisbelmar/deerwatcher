import path from 'path'
import { LOCAL_DEPENDENCIES_PATH } from '../constants'

export interface ConfigPackage {
  path: string
  ignore?: string[]
}

export interface LocalPackage {
  name: string
  path: string
  modulePath: string
  ignore: string[]
}

const getLocalPackages = (packages: Record<string, ConfigPackage | string>) => {
  const packageNames = Object.keys(packages)

  if (packageNames.length === 0) {
    return undefined
  }

  const localPackages: LocalPackage[] = packageNames.map(key => ({
    name: key,
    path: (packages[key] as ConfigPackage)?.path || packages[key] as string,
    modulePath: path.join(LOCAL_DEPENDENCIES_PATH, key),
    ignore: (packages[key] as ConfigPackage)?.ignore || []
  }))

  return localPackages
}

export default getLocalPackages
