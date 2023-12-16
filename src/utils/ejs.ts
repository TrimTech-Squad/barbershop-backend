import ejs from 'ejs'

export const renderHTML = (
  path: string,
  data: Record<string, unknown>,
  opts: ejs.Options,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(path, data, opts, (err, str) => {
      if (err) reject(err)
      return resolve(str)
    })
  })
}
