import { $, cd } from 'zx'

export class GitUtil {
  constructor(public readonly repositoriePath: string) {}

  private __cd() {
    cd(this.repositoriePath)
  }

  public async getbranchName() {
    this.__cd()
    const branch = await $`git rev-parse --abbrev-ref HEAD`
    return branch.toString().trim()
  }

  public async getShortCommitId() {
    this.__cd()
    const commitId = await $`git rev-parse --short HEAD`
    return commitId.toString().trim()
  }

  public async getCommitId() {
    this.__cd()
    const commitId = await $`git rev-parse HEAD`
    return commitId.toString().trim()
  }

  public async getUserName() {
    this.__cd()
    const username = await $`git config user.name`
    return username.toString().trim()
  }

  public async getUserEMail() {
    this.__cd()
    const email = await $`git config user.email`
    return email.toString().trim()
  }

  public async add(file: string) {
    this.__cd()
    await $`git add ${file}`
  }

  public async addAll() {
    this.__cd()
    await $`git add .`
  }

  public async commit(message: string) {
    this.__cd()
    await $`git commit -m "${message}"`
  }

  public async commitAll(message: string) {
    this.__cd()
    await $`git commit -a -m ${message}`
  }

  public async submodulesUpdateInit() {
    this.__cd()
    await $`git submodule update --init`
  }

  public async pullRebaseOrigin() {
    this.__cd()
    await $`git pull --progress -v --rebase "origin"`
  }

  public async pullNoRebaseOrigin() {
    this.__cd()
    await $`git pull --progress -v --no-rebase "origin"`
  }

  public async checkout(branch: string) {
    this.__cd()
    await $`git checkout ${branch}`
  }

  public async checkoutOrigin(branch: string) {
    this.__cd()
    await $`git checkout -b ${branch} --track origin/${branch}`
  }

  public async pushOrigin(localbranch: string, remotebranch?: string) {
    this.__cd()
    remotebranch = remotebranch ?? localbranch
    await $`git push --progress -v "origin" ${localbranch}:${remotebranch}`
  }
}
