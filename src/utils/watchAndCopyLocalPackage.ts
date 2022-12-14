import chokidar from 'chokidar'
import fs from 'fs/promises'
import { copyFile, copyFolderContentRecursive } from './copy'
import type { LocalPackage } from './getLocalPackages'
import mkdirRecursive from './mkdirRecursive'

const copyLocalDependency = async (localPackage: LocalPackage, ignored: string[]) => {
  await mkdirRecursive(localPackage.modulePath)
  await copyFolderContentRecursive(localPackage.path, localPackage.modulePath, ignored)
}

const watchAndCopyLocalPackage = async (
  localPackage: LocalPackage,
  cb: () => void
) => {
  const ignored = Array.from(new Set(['node_modules', '.git', ...localPackage.ignore]))
  await copyLocalDependency(localPackage, ignored)
  cb()

  const dependencyWatcher = chokidar.watch(
    localPackage.path,
    {
      ignoreInitial: true,
      // FIXME: Fix ignore!
      ignored
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
