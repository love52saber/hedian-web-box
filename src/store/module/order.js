/*
 * @Author: chenghao
 * @Date: 2018-12-03 15:24:27
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-03 15:54:06
 * @desc: 工单类数据流
 */
import * as orderApi from '@/api/order'

export default {
  state: {
    orderList: [], // 维修工单列表
    orderTotal: 0, // 维修工单总数
    myHandleList: [], // 我的处理
    myHandleTotal: 0, // 我的处理总数
    myCreateList: [], // 我的创建列表
    myCreateTotal: 0, // 我的创建总数
    SLA: '',
    flowMap: {
      '0': '创建',
      '1': '审核',
      '2': '派发',
      '3': '查看',
      '4': '处理',
      '5': '确认',
      '6': '基层评价',
      '7': '科信评价'
    },
    wfStatusList: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '已完成',
        value: 1
      },
      {
        label: '进行中',
        value: 0
      }
    ],
    wfGroup: [],
    wfPerson: [], // 创建时审批人列表
    wfUserList: [], // 流程处理人
    submitToReview: {},
    evaluatorList: [] // 维修工单评价人管理列表
  },
  mutations: {
    setOrderList (state, data) {
      state.orderList = data
    },
    setOrderTotal (state, num) {
      state.orderTotal = num
    },
    setMyHandleList (state, data) {
      state.myHandleList = data
    },
    setMyHandleTotal (state, num) {
      state.myHandleTotal = num
    },
    setSLA (state, data) {
      state.SLA = data
    },
    setMyCreateList (state, data) {
      state.myCreateList = data
    },
    setMyCreateTotal (state, data) {
      state.myCreateTotal = data
    },
    setWfGroup (state, data) {
      state.wfGroup = data
    },
    setWfPerson (state, data) {
      state.wfPerson = data
    },
    setWfUserList (state, data) {
      state.wfUserList = data
    },
    setSubmitToReview (state, data) {
      state.submitToReview = data
    },
    setEvaluatorList (state, data) {
      state.evaluatorList = data
    }
  },
  actions: {
    // 获取工单列表
    getOrderList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        orderApi
          .getOrderList(params)
          .then(res => {
            console.log('===工单列表===', res)
            resolve(res)
            if (!res) return
            const data = res.data
            const { currentUser, handleId, userId } = params
            if (res.msg !== 'success') return
            res.data.list.map(item => {
              if (item.currentStep !== 0) {
                item._disabled = true
              }
            })
            if (currentUser) {
              commit('setMyTodo', res.data)
            } else if (handleId) {
              commit('setMyHandle', res.data)
            } else if (userId) {
              commit('setMyCreate', res.data)
            } else {
              commit('setOrderList', res.data)
            }
            commit('setOrderTotal', data.total)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // SLA考核定义
    getSLA ({ commit }) {
      return new Promise((resolve, reject) => {
        orderApi
          .getSLA()
          .then(res => {
            console.log('===工单SLA考核===', res)
            resolve(res)
            if (!res) return
            commit('setSLA', res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取工单组
    getWfGroup ({ commit }) {
      return new Promise((resolve, reject) => {
        orderApi
          .getWfGroup()
          .then(res => {
            console.log('===工单处理组===', res)
            resolve(res)
            if (!res) return
            commit('setWfGroup', res.data.list)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取工单组下的人
    getWfPeople ({ commit }, grpId) {
      return new Promise((resolve, reject) => {
        orderApi
          .getWfPeople(grpId)
          .then(res => {
            console.log('===工单处理用户===', res)
            resolve(res)
            if (!res) return
            commit('setWfPerson', res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取流程处理人
    getWfUserList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        orderApi
          .getWfUserList(params)
          .then(res => {
            console.log('===流程处理人===', res)
            resolve(res)
            if (!res) return
            if (res.data) {
              commit('setWfUserList', res.data)
            } else {
              commit('setWfUserList', [])
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取维修工单评价人管理列表
    getEvaluatorList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        orderApi
          .getEvaluatorList(params)
          .then(res => {
            console.log('===维修工单评价人管理===', res)
            resolve(res)
            if (!res) return
            commit('setEvaluatorList', data.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
