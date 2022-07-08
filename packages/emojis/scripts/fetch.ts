import { get } from 'https'
import { writeFile } from 'fs'

const emojisUrl = 'https://api.github.com/emojis'

const fetchGitEmojis = () => {
  get(
    emojisUrl,
    {
      headers: { 'User-Agent': '@kazurajs/emojis' },
    },
    (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.setEncoding('utf8')
      res.on('end', () => {
        writeFile(
          './cache/git-emojis.ts',
          `export default ${data}`,
          'utf8',
          (err) => {
            if (err) {
              throw new Error(err.message)
            }
            console.log('映射生成成功')
          }
        )
      })
    }
  )
}

fetchGitEmojis()
