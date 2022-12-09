import fs from 'fs/promises'
import { copyFile, copyFolderContentRecursive } from './copy'

jest.mock('fs/promises', () => ({
  copyFile: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn(() => ({
    isDirectory: jest.fn(() => false)
  }))
}))

describe('copy', () => {
  it('should copy a file', async () => {
    const sourcePath = 'a'
    const targetPath = 'b'

    await copyFile(sourcePath, targetPath)

    expect(fs.copyFile).toHaveBeenCalledWith(sourcePath, targetPath)
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
})
