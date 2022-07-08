import emojis from '../cache/git-emojis'
import fs from 'fs'

const generate = () => {
  const keys = Object.keys(emojis)
  fs.writeFile(
    './src/types.ts',
    `export type EmojiKey = '${Object.keys(emojis).join("' | '")}'

export const emojiKeys:EmojiKey[] = ['${keys.join("','")}']
`,
    'utf8',
    (err) => {
      if (err) {
        throw new Error(err.message)
      }
      console.log('生成样式成功')
    }
  )
}

generate()
