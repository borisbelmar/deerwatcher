import fs from 'fs/promises'
import mkdirRecursive from './mkdirRecursive'

jest.mock('fs/promises', () => ({
  mkdir: jest.fn()
}))

class ErrorFs extends Error {
  code = 'EEXIST'
}

describe('mkdirRecursive', () => {
  beforeEach(() => {
    (fs.mkdir as unknown as jest.Mock).mockClear()
  })

  it('should create a directory', async () => {
    const dir = 'a'

    await mkdirRecursive(dir)

    expect(fs.mkdir).toHaveBeenCalledWith(dir)
  })

  it('should create a directory recursively', async () => {
    const dir = 'a/b/c'

    await mkdirRecursive(dir)

    expect(fs.mkdir).toHaveBeenNthCalledWith(1, 'a')
    expect(fs.mkdir).toHaveBeenNthCalledWith(2, 'a/b')
    expect(fs.mkdir).toHaveBeenNthCalledWith(3, 'a/b/c')
  })

  it('should do nothing if directory already exists', async () => {
    const dir = 'a/b/c';

    (fs.mkdir as unknown as jest.Mock).mockImplementationOnce(() => {
      const error = new ErrorFs('Directory already exists')
      throw error
    })

    await mkdirRecursive(dir)

    expect(fs.mkdir).toHaveBeenNthCalledWith(1, 'a')
    expect(fs.mkdir).toHaveBeenNthCalledWith(2, 'a/b')
    expect(fs.mkdir).toHaveBeenNthCalledWith(3, 'a/b/c')
  })

  it('should throw an error if directory cannot be created', async () => {
    const dir = 'a/b/c';

    (fs.mkdir as unknown as jest.Mock).mockImplementationOnce(() => {
      const error = new ErrorFs('Permission denied')
      error.code = 'EACCES'
      throw error
    })

    await expect(mkdirRecursive(dir)).rejects.toThrow('Permission denied')
  })
})
