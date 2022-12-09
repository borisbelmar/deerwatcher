import getDirsJerarchy from './getDirsJerarchy'

describe('getDirsJerarchy', () => {
  it('should return an array of paths', () => {
    const dirPath = 'a/b/c/d/e'
    const expected = ['a', 'a/b', 'a/b/c', 'a/b/c/d', 'a/b/c/d/e']

    expect(getDirsJerarchy(dirPath)).toEqual(expected)
  })
})
