import { Aes128Ecb } from '.'

const key = Aes128Ecb.generateBase64Key()

const plaintext = 'Hello, world!'

const ciphertext = Aes128Ecb.encryptWithBase64Key(plaintext, key)

const decrypted = Aes128Ecb.decryptWithBase64Key(ciphertext, key)

console.log('Key:', key)

console.log('Plaintext:', plaintext)

console.log('Ciphertext1:', ciphertext)

console.log('Decrypted1:', decrypted)
