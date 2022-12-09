import chokidar from 'chokidar'
import fs from 'fs/promises'
import { copyFile, copyFolderContentRecursive } from './copy'
import type { LocalPackage } from './getLocalPackages'
import mkdirRecursive from './mkdirRecursive'

const copyLocalDependency = async (localPackage: LocalPackage) => {
  await mkdirRecursive(localPackage.modulePath)
  await copyFolderContentRecursive(localPackage.path, localPackage.modulePath)
}

const watchAndCopyLocalPackage = async (
  localPackage: LocalPackage,
  cb: () => void
) => {
  await copyLocalDependency(localPackage)
  cb()

  const dependencyWatcher = chokidar.watch(
    localPackage.path,
    {
      ignoreInitial: true,
      // FIXME: Fix ignore!
      ignored: Array.from(new Set(['node_modules', ...localPackage.ignore]))
    }
  )

  dependencyWatcher
    .on('all', (event, filePath) => {
      const targetPath = filePath.replace(localPackage.path, localPackage.modulePath)
      switch (event) {
        case 'add':
          console.log('New file added: ', filePath)
          copyFile(filePath, targetPath)
          break
        case 'change':
          console.log('File changed: ', filePath)
          copyFile(filePath, targetPath)
          break
        case 'unlink':
          console.log('File deleted: ', filePath)
          fs.unlink(targetPath)
          break
        default:
          console.log('Unknown event: ', event)
      }

      cb()
    })
}

export default watchAndCopyLocalPackage
