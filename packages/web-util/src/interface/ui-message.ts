export interface UIMessage<Content, Config, Instance> {
  open(content: Content): Instance
  success(content: Content): Instance
  error(content: Content): Instance
  warning(content: Content): Instance
  info(content: Content): Instance
  loading(content: Content): Instance
  config(config: Config): void
  destroy(id: string | number): void
}
