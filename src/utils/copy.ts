import fs from 'fs/promises'
import path from 'path'
import mkdirRecursive from './mkdirRecursive'

export const copyFile = async (sourcePath: string, targetPath: string) => {
  const stats = await fs.stat(sourcePath)

  if (stats.isDirectory()) {
    await mkdirRecursive(targetPath)
    // eslint-disable-next-line no-use-before-define
    await copyFolderContentRecursive(sourcePath, targetPath)
  } else {
    await fs.copyFile(sourcePath, path.join(targetPath))
  }
}

export const copyFolderContentRecursive = async (
  source: string,
  target: string,
  ignored?: string[]
) => {
  const files = await fs.readdir(source)

  const copyAllFiles = files.map(async file => {
    const sourcePath = path.join(source, file)
    const targetPath = path.join(target, file)

    // ignore files on ignored folders or files in ignored array
    if (
      ignored?.includes(file)
      || ignored?.includes(sourcePath)
      || ignored?.some(ignoredPath => file.startsWith(ignoredPath))
    ) {
      return
    }

    await copyFile(sourcePath, targetPath)
  })

  await Promise.all(copyAllFiles)
}
