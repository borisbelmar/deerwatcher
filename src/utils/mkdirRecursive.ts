import fs from 'fs/promises'
import getDirsJerarchy from './getDirsJerarchy'

const mkdirRecursive = async (dirPath: string | string[]) => {
  let dirs
  if (Array.isArray(dirPath)) {
    dirs = dirPath
  } else {
    dirs = getDirsJerarchy(dirPath)
  }

  const dir = dirs.shift()

  if (!dir) {
    return
  }

  try {
    await fs.mkdir(dir)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }

  await mkdirRecursive(dirs)
}

export default mkdirRecursive
