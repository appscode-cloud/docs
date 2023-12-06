declare module '*.vue'


declare module '@bytebuilders/docs-base/config' {
  import { UserConfig } from 'vitepress'
  const baseConfig: () => Promise<UserConfig>
  export default baseConfig
}
