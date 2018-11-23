/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:09:19
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-23 09:12:08
 * @desc: 用户类数据流
 */
import * as userApi from '@/api/user'
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
    forgotPassword: '',
    showUpdateUserInfoModal: false,
    showUpdatePasswordModal: false,
    hasGetInfo: false,
    organizationalUnit: [], // 组织单位数据
    roleList: [],
    allRoleList: [],
    roleTotal: 0,
    menuTreeData: [],
    userList: [],
    userTotal: 0,
    userGroupList: [],
    userGroupTotal: 0,
    // TODO:待查验字段是否有用
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
    setForgotPassword (state, value) {
      state.forgotPassword = value
    },
    setShowUpdateUserInfoModal (state, status) {
      state.showUpdateUserInfoModal = !!status
    },
    setShowUpdatePasswordModal (state, status) {
      state.showUpdatePasswordModal = !!status
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setOrganizationalUnit (state, data) {
      state.organizationalUnit = data
    },
    setRoleList (state, data) {
      state.roleList = data
    },
    setAllRoleList (state, data) {
      state.allRoleList = data
    },
    setRoleTotal (state, num) {
      state.roleTotal = num
    },
    setUserList (state, data) {
      state.userList = data
    },
    setUserTotal (state, num) {
      state.userTotal = num
    },
    setUserGroupList (state, data) {
      state.userGroupList = data
    },
    setUserGroupTotal (state, num) {
      state.userGroupTotal = num
    },
    // TODO:待查验字段是否有用
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMenuTreeData (state, list) {
      state.menuTreeData = list
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
        userApi
          .login({
            username,
            password
          })
          .then(res => {
            if (res.msg === 'success') {
              const data = res.data
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
    // 忘记密码
    forgotPassword ({ commit }) {
      return new Promise((resolve, reject) => {
        userApi
          .forgotPassword()
          .then(res => {
            // console.log('===忘记密码配置===', res)
            if (res.msg === 'success') {
              const data = res.data.paravalue.replace(/\\r\\n/g, '<br/>')
              commit('setForgotPassword', data)
            }
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 修改用户资料
    updateUserInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .updateUserInfo(params)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 修改密码
    updatePassword ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .updatePassword(params)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取组织单位
    getOrganizationalUnit ({ commit }) {
      return new Promise((resolve, reject) => {
        userApi
          .getOrganizationalUnit()
          .then(res => {
            // console.log('===获取组织单位（页面）===', res)
            commit('setOrganizationalUnit', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 新增组织单位
    addUnit ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .addUnit(params)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    // 修改组织单位
    updateUnit ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .updateUnit(params)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    // 删除组织单位
    deleteUnit ({ commit }, deptId) {
      return new Promise((resolve, reject) => {
        userApi
          .deleteUnit(deptId)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    // 获取角色列表
    getRoleList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .getRoleList(params)
          .then(res => {
            console.log('===获取角色列表（页面）===', res)
            commit('setRoleList', res.data.list)
            const { total = 0 } = res.data
            commit('setRoleTotal', total)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取全部角色
    getAllRoleList ({ commit }) {
      return new Promise((resolve, reject) => {
        userApi
          .getAllRoleList()
          .then(res => {
            console.log('===获取全部角色列表===', res)
            commit('setAllRoleList', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取权限树
    getMenuTreeData ({ commit }) {
      return new Promise((resolve, reject) => {
        userApi
          .getMenuTreeData()
          .then(res => {
            console.log('===获取权限菜单===', res)
            commit('setMenuTreeData', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 新增角色
    addRole ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .addRole(params)
          .then(res => {
            console.log('===角色新增===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 角色修改
    updateRole ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .updateRole(params)
          .then(res => {
            console.log('===角色修改===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除角色
    deleteRole ({ commit }, roleId) {
      return new Promise((resolve, reject) => {
        userApi
          .deleteRole(roleId)
          .then(res => {
            console.log('===角色修改===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取用户列表
    getUserList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .getUserList(params)
          .then(res => {
            console.log('===获取用户列表（页面）===', res)
            res.data.list.forEach(item => {
              if (!item.delflag) {
                item._disabled = true
              }
            })
            commit('setUserList', res.data.list)
            const { total = 0 } = res.data
            commit('setUserTotal', total)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 新增用户
    addUser ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .addUser(params)
          .then(res => {
            console.log('===用户新增===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 修改用户
    updateUser ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .updateUser(params)
          .then(res => {
            console.log('===用户删除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 锁定/解锁用户
    lockUser ({ commit }, { userId, lockInfo }) {
      return new Promise((resolve, reject) => {
        userApi
          .lockUser(userId, lockInfo)
          .then(res => {
            console.log('===用户锁定/解锁===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除用户
    deleteUser ({ commit }, userId) {
      return new Promise((resolve, reject) => {
        userApi
          .deleteUser(userId)
          .then(res => {
            console.log('===用户删除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getUserGroupList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userApi
          .getUserGroupList(params)
          .then(res => {
            console.log('===获取用户组列表（页面）===', res)
            res.data.list.forEach(item => {
              if (!item.delflag) {
                item._disabled = true
              }
            })
            commit('setUserGroupList', res.data.list)
            const { total = 0 } = res.data
            commit('setUserGroupTotal', total)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // TODO:待定是否有用
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
