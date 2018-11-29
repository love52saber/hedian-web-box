export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://192.168.1.31:8081',
    pro: 'http://192.168.1.23:8099'
  },
  /**
   * @description 文件服务器地址
   */
  fileHost: process.env.NODE_ENV === 'development' ? 'http://192.168.1.23:9005/znyw' : 'http://192.168.1.23:9005/znyw',
  /**
   * @description websocket地址
   */
  wsUrl:
    process.env.NODE_ENV === 'development'
      ? 'ws://192.168.1.23:8099/api/websocket/'
      : 'ws://192.168.1.23:8099/api/websocket/',
  /**
   * @description 高德地图的key
   */
  AMAP_KEY: '0dfdcddd576a40eb8db6b4588f6f3c81',
  /**
   * @description 请求超时时间
   */
  TIME_OUT: 10000,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home'
}
