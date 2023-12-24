import ejs from 'ejs'

export const renderHTML = (
  path: string,
  data: Record<string, unknown>,
  opts: ejs.Options,
): Promise<string> => {

  // Mengembalikan sebuah Promise yang akan merender template EJS
  return new Promise((resolve, reject) => {

    // Menggunakan fungsi renderFile dari EJS untuk merender template
    ejs.renderFile(path, data, opts, (err, str) => {

      // Jika terjadi error pada saat rendering, reject Promise dengan error tersebut
      if (err) return reject(err)

      // Jika rendering sukses, resolve Promise dengan hasil rendering dalam bentuk string
      return resolve(str)
    })
  })
}
