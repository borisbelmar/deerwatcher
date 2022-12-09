import getConfig from './getConfig'
import startWatchers from './startWatchers'
import { spawnChildProcess } from './utils/spawnChildProcess'

const cli = async () => {
  const config = await getConfig()

  const handleWatchEvent = () => {
    spawnChildProcess(config?.command)
  }

  console.log('Starting deerwatcher...')

  await startWatchers(handleWatchEvent, config?.packages)
}

export default cli
