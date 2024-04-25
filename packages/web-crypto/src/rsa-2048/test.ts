import { Rsa2048 } from '.'

const certificate = Rsa2048.createCertificate()

const plaintext = 'Hello, world!'

const encrypted = Rsa2048.encrypt(plaintext, certificate.pubkey)

const decrypted = Rsa2048.decrypt(encrypted as string, certificate.privkey)

console.log('Certificate:', certificate)

console.log('Plaintext:', plaintext)

console.log('Ciphertext1:', encrypted)

console.log('Decrypted1:', decrypted)
