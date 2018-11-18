/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:09:19
 * @Last Modified by:   chenghao
 * @Last Modified time: 2018-11-17 14:09:19
 * @desc: 用户类数据流
 */
import {
  login
  // getUserInfo,
  // getMessage,
  // getContentByMsgId,
  // hasRead,
  // removeReaded,
  // restoreTrash
} from '@/api/user'
import { setToken, getToken, getUserInfo, setUserInfo } from '@/libs/util'
import _ from 'lodash'

export default {
  state: {
    username: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    userInfo: '',
    access: '',
    hasGetInfo: false,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.username = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setUserInfo (state, user) {
      state.userInfo = user
      setUserInfo(user)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password }) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        })
          .then(res => {
            if (res.msg === 'success') {
              const data = res.data
              console.log(data.token)
              commit('setToken', data.token)
              commit('setUserInfo', data.user)
            }
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
        commit('setUserInfo', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          if (getUserInfo()) {
            const user = JSON.parse(getUserInfo())
            commit('setAvator', _.get(user, 'sysFile.url', ''))
            commit('setUserName', user.name)
            commit('setUserId', user.userId)
            commit('setAccess', [])
            commit('setHasGetInfo', true)
          }
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage()
          .then(res => {
            const { unread, readed, trash } = res.data
            commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
            commit(
              'setMessageReadedList',
              readed
                .map(_ => {
                  _.loading = false
                  return _
                })
                .sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
            )
            commit(
              'setMessageTrashList',
              trash
                .map(_ => {
                  _.loading = false
                  return _
                })
                .sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
            )
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id)
          .then(() => {
            commit('moveMsg', {
              from: 'messageUnreadList',
              to: 'messageReadedList',
              msg_id
            })
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id)
          .then(() => {
            commit('moveMsg', {
              from: 'messageReadedList',
              to: 'messageTrashList',
              msg_id
            })
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id)
          .then(() => {
            commit('moveMsg', {
              from: 'messageTrashList',
              to: 'messageReadedList',
              msg_id
            })
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
