/**
 * 产生通知
 * @param title - 通知标题
 * @param options - 通知选项
 * @returns - 生成的通知实例，如果通知不被支持或权限不足则返回 undefined
 */
export const spawnNotification = (
  title: string,
  options?: NotificationOptions
): Notification | undefined => {
  if ('Notification' in window) {
    if (Notification.permission !== 'granted') {
      requestNotificationPermission()
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(title, options)
      notification.onclick = () => window.focus()
      return notification
    }
  }
}

/**
 * 请求通知权限
 * @returns - 用户是否授予通知权限
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
  }

  return false
}
