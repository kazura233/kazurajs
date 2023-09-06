const MESSAGE_TAG: string = 'application/x-web-broadcast-proxy-v1'

const broadcastPool: Map<string, BroadcastChannel> = new Map()

const eventHandler = (
  event: MessageEvent<{
    tag: string
    channelName: string
    data: any
  }>
) => {
  const { data } = event
  if (typeof data === 'object' && 'tag' in data && data.tag === MESSAGE_TAG) {
    const { channelName, data: message } = data
    let broadcast = broadcastPool.get(channelName)
    if (!broadcast) {
      broadcast = new BroadcastChannel(channelName)
      broadcastPool.set(channelName, broadcast)
    }
    broadcast.postMessage(message)
  }
}

window.addEventListener('message', eventHandler)
