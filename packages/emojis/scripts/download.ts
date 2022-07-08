import emojis from '../cache/git-emojis'
import { get } from 'https'
import fs, { writeFile, access } from 'fs'

const fetch = (url: string, path: string) => {
  get(
    url,
    {
      headers: { 'User-Agent': '@kazurajs/emojis233' },
    },
    (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.setEncoding('binary')
      res.on('end', () => {
        writeFile(path, data, 'binary', (err) => {
          if (err) {
            throw new Error(err.message)
          }
          console.log(url + ' 下载成功')
        })
      })
    }
  )
}

const download = () => {
  for (const [name, url] of Object.entries(emojis)) {
    const file = './cache/git-emojis-img/' + name + '.png'
    access(file, fs.constants.F_OK, (err) => {
      if (err) fetch(url, file)
    })
  }
}

download()
