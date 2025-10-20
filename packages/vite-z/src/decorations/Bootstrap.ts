export function Bootstrap(): ClassDecorator {
  return (target) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Bootstrap] Detected bootstrap class: ${target.name}`)
    }
    return target
  }
}
