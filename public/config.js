/*
 * @Author: chenghao
 * @Date: 2018-11-30 14:01:08
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-04 09:54:10
 * @Desc: 项目配置单独分离,方便打包后部署
 */
window.config = {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,

  /**
   * @description 是否使用国际化，默认为false
   */
  useI18n: false,

  /**
   * @description 高德地图key
   */
  AMAP_KEY: '0dfdcddd576a40eb8db6b4588f6f3c81',

  /**
   * @description 请求超时时间10000毫秒
   */
  TIME_OUT: 10000,

  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',

  /**
   * @description 名称类表单元素的长度限制
   */
  NAME_LENGTH_LIMIT: 10,

  /**
   * @description 描述类表单元素的长度限制
   */
  DESC_LENGTH_LIMIT: 120,

  /**
   * @description 查看详情按钮配置
   */
  DETAIL_ICON: 'md-eye',

  /**
   * @description 修改按钮配置
   */
  UPDATE_ICON: 'md-create',

  /**
   * @description 删除按钮配置
   */

  DELETE_ICON: 'md-trash',

  /**
   * @description 默认最大功率值
   */
  VUE_APP_DEFAULT_POWER_MAX: 200,

  /**
   * @description 默认最大电压值
   */
  VUE_APP_DEFAULT_VOLTAGE_MAX: 400,

  /**
   * @description 默认最大电流值
   */
  VUE_APP_DEFAULT_CURRENT_MAX: 10,

  /**
   * @description api请求基础路径
   */
  baseUrl: 'http://192.168.1.23:8099', // 开发环境请求基础路径
  // baseUrl: 'http://192.168.1.23:8099', // 生产环境请求基础路径，开发进行中需要被注释

  /**
   * @description 文件服务地址
   */
  fileHost: 'http://192.168.1.23:9005/znyw', // 开发环境文件服务地址
  // fileHost: 'http://192.168.1.23:9005/znyw', // 生产环境文件服务地址

  /**
   * @description websocket地址
   */
  wsUrl: 'ws://192.168.1.23:8099/api/websocket/' // 开发环境websocket地址
  // wsUrl: 'ws://192.168.1.23:8099/api/websocket/' // 生产环境websocket地址
}
