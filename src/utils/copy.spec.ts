import fs from 'fs/promises'
import { copyFile, copyFolderContentRecursive } from './copy'

jest.mock('fs/promises', () => ({
  copyFile: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn(() => ({
    isDirectory: jest.fn(() => false)
  })),
  mkdir: jest.fn()
}))

describe('copy', () => {
  it('should copy a file', async () => {
    const sourcePath = 'a'
    const targetPath = 'b'

    await copyFile(sourcePath, targetPath)

    expect(fs.copyFile).toHaveBeenCalledWith(sourcePath, targetPath)
  })

  it('should copy a folder', async () => {
    const sourcePath = 'a'
    const targetPath = 'b';

    (fs.stat as unknown as jest.Mock).mockResolvedValueOnce({
      isDirectory: jest.fn(() => true)
    })

    const files = ['c', 'd'];

    (fs.readdir as unknown as jest.Mock).mockResolvedValueOnce(files)

    await copyFile(sourcePath, targetPath)

    expect(fs.copyFile).toBeCalledWith('a/c', 'b/c')
    expect(fs.copyFile).toBeCalledWith('a/d', 'b/d')
  })
})

describe('copyFolderContentRecursive', () => {
  it('should copy a folder content recursively', async () => {
    const source = 'a'
    const target = 'b'

    const files = ['c', 'd'];

    (fs.readdir as unknown as jest.Mock).mockResolvedValueOnce(files)

    await copyFolderContentRecursive(source, target)
  })

  it('should ignore files on ignored folders', async () => {
    const source = 'a'
    const target = 'b'

    const files = ['node_modules/c', 'd'];

    (fs.readdir as unknown as jest.Mock).mockResolvedValueOnce(files)

    await copyFolderContentRecursive(source, target, ['node_modules'])

    expect(fs.copyFile).not.toHaveBeenCalledWith('a/node_modules/c', 'b/node_modules/c')
  })
})
