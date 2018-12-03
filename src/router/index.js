import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, setAppTitle, canTurnTo } from '@/libs/util'
const { homeName } = window.config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

/**
 * 权鉴参数，key为路由内的页面name，value为后端配的url值
 * 权鉴是如何做的？
 * 登录后从登录接口拿到菜单menuList的返回值，存到本地，最初是想存cookie的，发现行不通，因为数据量超过限制，就存在本地了localStorage
 * 每次页面跳转，都会优先判断是否在"页面白名单"里，如果在，返回true
 * 如果不在白名单内，则判断传入的name（ROUTE_MAP对象的value）在不在本地存储内，如果能查询到，返回true(用的字符串的indexOf方法)
 * 不在白名单内也查询不到本地的indexOf，返回false，无权该访问页面，进入error_401页面
 */
const ROUTE_MAP = {
  home: 'home',
  myOrder: '/myWorkflow/pageList',
  repair: '/workflow/pageList',
  object: '/resBase/pageList',
  target: '/moKpi/pageList',
  threshold: '/moThreshold/pageList',
  domain: '/md/pageList',
  realTimeAbnormal: '/resMoAbnormalInfo/pageList',
  historyAbnormal: '/resMoAbnormalInfoH/pageList',
  ms: '/maintainStrategy/pageList',
  fms: '/fms/pageList',
  organitionalUnit: '/sysDept/treeAll',
  user: '/sysUser/pageList',
  userGroup: '/sysGroup/pageList',
  role: '/sysRole/pageList',
  error_401: 'error_401',
  error_404: 'error_404',
  error_500: 'error_500'
}

const turnTo = (to, next) => {
  if (canTurnTo(ROUTE_MAP[to.name])) next()
  // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  const title = to.meta.title
  setAppTitle(title)
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    // TODO:这里有问题,登录进来
    next()
    if (store.state.user.hasGetInfo) {
      // next()
      turnTo(to, next)
    } else {
      store
        .dispatch('getUserInfo')
        .then(user => {
          // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
          turnTo(to, next)
          // next()
        })
        .catch(() => {
          setToken('')
          next({
            name: 'login'
          })
        })
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
