import fs from 'fs'
import archiver from 'archiver'
import unzipper from 'unzipper'

/**
 * 压缩目录为 zip 文件
 * @param sourceDir 要压缩的目录
 * @param outPath 输出的 zip 文件路径
 */
export async function zip(sourceDir: string, outPath: string): Promise<void> {
  const output = fs.createWriteStream(outPath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)

  archive.directory(sourceDir, false)

  await archive.finalize()

  await new Promise<void>((resolve, reject) => {
    output.on('close', resolve)
    output.on('error', reject)
  })
}

/**
 * 解压 zip 文件到指定目录
 * @param zipFilePath ZIP 文件路径
 * @param outDir 解压到的目录
 */
export async function unzip(zipFilePath: string, outDir: string) {
  const directory = await unzipper.Open.file(zipFilePath)
  await directory.extract({ path: outDir })
}
