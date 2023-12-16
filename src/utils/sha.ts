import crypto from 'crypto'
import bcrypt from 'bcrypt'

export const generateSha512 = (decoded: string) => {
  const hash = crypto.createHash('sha512')
  //passing the data to be hashed
  const data = hash.update(decoded, 'utf-8')
  //Creating the hash in the required format
  const gen_hash = data.digest('hex')
  //Printing the output on the console
  return gen_hash
}

export const generateHash = (decoded: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(decoded, 10, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
}

export const compareHash = (decoded: string, hash: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(decoded, hash, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}
