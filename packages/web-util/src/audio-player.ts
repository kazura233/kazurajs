export type AudioConfig = {
  /**
   * 音频名称（可选）
   */
  name?: string
  /**
   * 音频URL，请传递完整路径，包含协议部份。
   * 错误的例子：/files/mp3/a.mp3
   * 正确的例子：https://www.example.com/files/mp3/a.mp3
   */
  url: string
  /**
   * 优先级
   */
  priority: number
}

export class AudioPlayer {
  private audio: HTMLAudioElement
  private isPlaying: boolean = false

  constructor(private audioConfigs: AudioConfig[]) {
    // 根据优先级对音频配置进行排序
    this.audioConfigs.sort((a, b) => a.priority - b.priority)

    this.audio = new Audio()
    this.audio.addEventListener('ended', this.handleAudioEnd)
    this.audio.addEventListener('error', (event) => {
      console.error('音频错误:', event)
    })
  }

  /**
   * 音频播放结束时的事件处理函数
   */
  private handleAudioEnd = () => {
    this.stop()
  }

  /**
   * 播放指定 URL 的音频
   * @param url 音频 URL
   */
  private playAudio(url: string) {
    this.audio.src = url
    this.audio.play()
    this.isPlaying = true
  }

  /**
   * 播放指定名称或 URL 的音频
   * @param name 音频名称或 URL
   * @returns
   */
  play(name: string) {
    // 查找要播放的音频配置
    const selectedAudio = this.audioConfigs.find(
      (audio) => audio.name === name || audio.url === name
    )

    if (!selectedAudio) {
      return
    }

    // 如果没有正在播放的音频，则直接播放
    if (!this.isPlaying) {
      this.playAudio(selectedAudio.url)
      return
    }

    // 查找当前正在播放的音频配置
    const currentlyPlaying = this.audioConfigs.find((audio) => audio.url === this.audio.src)

    // 如果正在播放的音频的优先级较高或相等，则不切换
    if (currentlyPlaying && currentlyPlaying.priority >= selectedAudio.priority) {
      return
    }

    // 停止当前播放，然后播放新的音频
    this.stop()
    this.playAudio(selectedAudio.url)
  }

  /**
   * 停止播放音频
   */
  stop() {
    // 暂停音频
    this.audio.pause()
    // 重置播放位置
    this.audio.currentTime = 0
    this.isPlaying = false
  }
}
