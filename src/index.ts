/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fs from 'fs/promises'
import path from 'path'
import chokidar from 'chokidar'
import { CONFIG_FILE_PATH, LOCAL_DEPENDENCIES_PATH } from './constants'
import mkdirRecursive from './utils/mkdirRecursive'
import { copyFile, copyFolderContentRecursive } from './utils/copy'
import { spawnChildProcess } from './utils/spawnChildProcess'

interface Dependency {
  name: string
  path: string
  modulePath: string
}

const copyLocalDependency = async (dependencyData: Dependency) => {
  await mkdirRecursive(dependencyData.modulePath)
  await copyFolderContentRecursive(dependencyData.path, dependencyData.modulePath)
}

const cli = async () => {
  try {
    await fs.access(CONFIG_FILE_PATH)
  } catch (e) {
    return
  }

  const [,, ...args] = process.argv

  const configFileStr = await fs.readFile(CONFIG_FILE_PATH, { encoding: 'utf-8' })
  const config = JSON.parse(configFileStr)

  await mkdirRecursive(LOCAL_DEPENDENCIES_PATH)

  const localDependenciesNames = Object.keys(config.packages)

  if (localDependenciesNames.length === 0) {
    return
  }

  const localDependencies = localDependenciesNames.map(key => ({
    name: key,
    path: config.packages[key],
    modulePath: path.join(LOCAL_DEPENDENCIES_PATH, key)
  }))

  for (const dependency of localDependencies) {
    await copyLocalDependency(dependency)
    // Watch for changes in local dependency and print event
    const command = args.join(' ') || config.command
    await spawnChildProcess(command)

    const dependencyWatcher = chokidar.watch(
      dependency.path,
      { ignoreInitial: true }
    )

    dependencyWatcher
      .on('all', (event, filePath) => {
        const targetPath = filePath.replace(dependency.path, dependency.modulePath)
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

        spawnChildProcess(command)
      })
  }
}

cli()
