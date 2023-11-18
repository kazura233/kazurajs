import { $, cd } from 'zx'

export class GitUtil {
  constructor(public readonly repositoryPath: string) {}

  private changeDirectory() {
    cd(this.repositoryPath)
  }

  public async getBranchName(): Promise<string> {
    this.changeDirectory()
    const branch = await $`git rev-parse --abbrev-ref HEAD`
    return branch.toString().trim()
  }

  public async getShortCommitId(): Promise<string> {
    this.changeDirectory()
    const commitId = await $`git rev-parse --short HEAD`
    return commitId.toString().trim()
  }

  public async getCommitId(): Promise<string> {
    this.changeDirectory()
    const commitId = await $`git rev-parse HEAD`
    return commitId.toString().trim()
  }

  public async getUserName(): Promise<string> {
    this.changeDirectory()
    const username = await $`git config user.name`
    return username.toString().trim()
  }

  public async getUserEmail(): Promise<string> {
    this.changeDirectory()
    const email = await $`git config user.email`
    return email.toString().trim()
  }

  public async add(file: string): Promise<void> {
    this.changeDirectory()
    await $`git add ${file}`
  }

  public async addAll(): Promise<void> {
    this.changeDirectory()
    await $`git add .`
  }

  public async commit(message: string): Promise<void> {
    this.changeDirectory()
    await $`git commit -m "${message}"`
  }

  public async commitAll(message: string): Promise<void> {
    this.changeDirectory()
    await $`git commit -a -m ${message}`
  }

  public async submodulesUpdateInit(): Promise<void> {
    this.changeDirectory()
    await $`git submodule update --init`
  }

  public async pullRebaseOrigin(): Promise<void> {
    this.changeDirectory()
    await $`git pull --progress -v --rebase "origin"`
  }

  public async pullNoRebaseOrigin(): Promise<void> {
    this.changeDirectory()
    await $`git pull --progress -v --no-rebase "origin"`
  }

  public async checkout(branch: string): Promise<void> {
    this.changeDirectory()
    await $`git checkout ${branch}`
  }

  public async checkoutOrigin(branch: string): Promise<void> {
    this.changeDirectory()
    await $`git checkout -b ${branch} --track origin/${branch}`
  }

  public async pushOrigin(localBranch: string, remoteBranch?: string): Promise<void> {
    this.changeDirectory()
    remoteBranch = remoteBranch ?? localBranch
    await $`git push --progress -v "origin" ${localBranch}:${remoteBranch}`
  }
}
