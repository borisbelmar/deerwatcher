import { LOCAL_DEPENDENCIES_PATH } from './constants'
import getConfig, { ConfigPackages } from './getConfig'
import getLocalPackages from './utils/getLocalPackages'
import mkdirRecursive from './utils/mkdirRecursive'
import watchAndCopyLocalPackage from './utils/watchAndCopyLocalPackage'

const startWatchers = async (
  onEvent: () => void,
  packages?: ConfigPackages
) => {
  let finalPackages: ConfigPackages | undefined

  if (!packages) {
    const config = await getConfig()
    finalPackages = config?.packages
  } else {
    finalPackages = packages
  }

  if (!finalPackages) {
    return
  }

  await mkdirRecursive(LOCAL_DEPENDENCIES_PATH)

  const localPackages = getLocalPackages(finalPackages)

  if (!localPackages) {
    return
  }

  const allWatchers = localPackages.map(async localPackage => {
    await watchAndCopyLocalPackage(localPackage, onEvent)
  })

  await Promise.all(allWatchers)
}

export default startWatchers
