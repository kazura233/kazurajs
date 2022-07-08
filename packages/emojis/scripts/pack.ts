import emojis from '../cache/git-emojis'
import fs, { promises as fsp } from 'fs'

async function pack(files: Record<string, string>) {
  const out: Record<string, string> = {}
  for (const [name] of Object.entries(files)) {
    const file = './cache/git-emojis-img/' + name + '.png'
    const content = await fsp.readFile(file)
    out[name] = `data:image/png;base64,${content.toString('base64')}`
  }

  return out
}

pack(emojis).then((out) => {
  fs.writeFile(
    './cache/git-emojis.chunk.ts',
    `export default ${JSON.stringify(out)}`,
    'utf8',
    (err) => {
      if (err) {
        throw new Error(err.message)
      }
      console.log('打包成功')
    }
  )
})
