/**
 * 产生通知
 * @param title
 * @param options
 * @returns
 */
export const spawnNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission !== 'denied') requestNotificationPermission()
  if (Notification.permission === 'granted') return new Notification(title, options)
}

/**
 * 请求通知权限
 * @returns
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}
