/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:08:45
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-30 15:09:46
 * @系统应用类数据流
 */
import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  setAppName,
  getAppName,
  localRead
} from '@/libs/util'
import beforeClose from '@/router/before-close'
import router from '@/router'
import routers from '@/router/routers'
import * as appApi from '@/api/app'
const { homeName } = window.config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    appName: getAppName() || '智能运维管理系统',
    showConfirmModal: false,
    local: localRead('local'),
    errorList: [],
    errorCount: state => state.errorList.length
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setAppName (state, name) {
      state.appName = name
    },
    setShowConfirmModal (state, status) {
      state.showConfirmModal = !!status
    }
  },
  actions: {
    getAppName ({ commit }) {
      return new Promise((resolve, reject) => {
        appApi
          .getAppName()
          .then(res => {
            if (res.msg === 'success') {
              const { data } = res
              commit('setAppName', data.paravalue)
              setAppName(data.paravalue)
            }
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
