import childProcess, { ChildProcess } from 'child_process'

let child: ChildProcess | undefined
let childProcessAlive = false

const spawnChildWithListeners = (command: string, args: string[]) => {
  const innerChild = childProcess.spawn(command, args, {
    stdio: 'inherit'
  })

  innerChild?.on('spawn', () => {
    childProcessAlive = true
  })

  innerChild?.on('exit', () => {
    childProcessAlive = false
  })

  innerChild?.on('error', () => {
    console.log('Error spawning child process')
  })

  return innerChild
}

export const spawnChildProcess = async (
  completeCommand?: string
): Promise<ChildProcess | undefined> => {
  if (!completeCommand) {
    return undefined
  }

  const [command, ...args] = completeCommand.split(' ')

  if (child && childProcessAlive) {
    child.on('exit', () => {
      childProcessAlive = false
      child = spawnChildWithListeners(command, args)
    })
    console.log('Restarting child process')
    child.kill('SIGTERM')
  } else {
    child = spawnChildWithListeners(command, args)
  }

  return child
}
