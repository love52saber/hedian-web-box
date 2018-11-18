// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import 'iview/dist/styles/iview.css'
import '../node_modules/leaflet/dist/leaflet.css'
import installPlugin from '@/plugin'
import '@/assets/icons/iconfont.css'
import dayjs from 'dayjs'
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView)
Vue.filter('formatTime', function(val) {
  return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
})
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

Vue.prototype.$Notice.config({
  top: 120,
  duration: 5
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
