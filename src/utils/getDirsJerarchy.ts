import path from 'path'

const getDirsJerarchy = (dirPath: string) => {
  const dirs = dirPath.split(path.sep)
  const paths: string[] = []

  dirs.forEach((_dir, idx) => {
    paths.push(dirs.slice(0, idx + 1).join(path.sep))
  })

  return paths
}

export default getDirsJerarchy
