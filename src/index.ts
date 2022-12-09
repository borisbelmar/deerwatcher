import startWatchers from './startWatchers'
import cli from './cli'

export { default as cli } from './cli'
export { default as startWatchers } from './startWatchers'

const DeerWatcher = {
  startWatchers,
  cli
}

export default DeerWatcher
