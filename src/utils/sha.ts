import crypto from 'crypto'
import bcrypt from 'bcrypt'

export const generateHashString = (
  decoded: string,
  opts: {
    disgest: 'hex' | 'base64'
    encoding: 'utf-8'
    aggorithm: 'sha256' | 'sha512'
  } = { disgest: 'hex', aggorithm: 'sha512', encoding: 'utf-8' },
) => {
  const hash = crypto.createHash(opts.aggorithm)
  //passing the data to be hashed
  const data = hash.update(decoded, opts.encoding)
  //Creating the hash in the required format
  const gen_hash = data.digest(opts.disgest)
  //Printing the output on the console
  return gen_hash
}

// menghasilkan hash menggunakan bcrypt
export const generateHash = (decoded: string) => {
  return new Promise((resolve, reject) => {

    // Menggunakan bcrypt untuk membuat hash dengan tingkat keamanan 10
    bcrypt.hash(decoded, 10, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
}

//  membandingkan data dengan hash menggunakan bcrypt
export const compareHash = (decoded: string, hash: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(decoded, hash, (err, res) => {
      if (err) reject(err)

      // Mengembalikan hasil perbandingan (true jika cocok, false jika tidak)
      resolve(res)
    })
  })
}
