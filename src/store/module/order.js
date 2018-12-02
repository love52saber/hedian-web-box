/*
 * @Author: chenghao
 * @Date: 2018-10-15 15:37:08
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-02 14:24:37
 */
import * as orderApi from '@/api/order'

const order = {
  state: {
    orderList: '', // 工单列表，包含total字段
    myTodo: '', // 我的代办
    myHandle: '', // 我的处理
    myCreate: '', // 我的创建
    SLA: '', // 工单考核sla
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
    wfGroup: [],
    wfPerson: [], // 创建时审批人列表
    wfUserList: [], // 流程处理人
    submitToReview: {}, // 创建提交审核
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
    evaluatorList: [] // 维修工单评价人管理列表
  },
  mutations: {
    setOrderList (state, data) {
      state.orderList = data
    },
    setMyTodo (state, data) {
      state.myTodo = data
    },
    setMyHandle (state, data) {
      state.myHandle = data
    },
    setMyCreate (state, data) {
      state.myCreate = data
    },
    setSLA (state, data) {
      state.SLA = data
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
    getOrderList ({ commit }, { params, vue }) {
      // 获取工单列表
      orderApi.getOrderList(params).then(res => {
        // console.log('===工单列表===', JSON.stringify(res))
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
      })
    },
    getSLA ({ commit }) {
      orderApi.getSLA().then(res => {
        // console.log('工单SLA考核', res)
        if (res.msg === 'success') {
          commit('setSLA', res.data)
        }
      })
    },
    getWfGroup ({ commit }) {
      orderApi.getWfGroup().then(res => {
        // console.log('工单处理组', JSON.stringify(res))
        if (res.msg === 'success') {
          commit('setWfGroup', res.data.list)
        }
      })
    },
    getWfPeople ({ commit }, grpId) {
      orderApi.getWfPeople(grpId).then(res => {
        console.log('工单处理用户', JSON.stringify(res))
        if (res.msg === 'success') {
          commit('setWfPerson', res.data)
        }
      })
    },
    getWfUserList ({ commit }, params) {
      // console.log('参数=', params)
      orderApi.wfUserList(params).then(res => {
        // console.log('流程处理人=', JSON.stringify(res))
        if (res.msg === 'success') {
          if (res.data) {
            commit('setWfUserList', res.data)
          } else {
            commit('setWfUserList', [])
          }
        }
      })
    },
    getEvaluatorList ({ commit }, { params }) {
      // 获取维修工单评价人管理列表
      orderApi.getEvaluatorList(params).then(data => {
        if (data.msg === 'success') {
          commit('setEvaluatorList', data.data)
        }
      })
    }
  }
}
export default order
