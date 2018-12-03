/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:09:02
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-03 13:53:57
 * @desc: 告警类数据流
 */
import * as abnormalApi from '@/api/abnormal'

export default {
  state: {
    warningNumber: 0, // 实时告警数目，用于header中的badge数字
    realTimeAlarmList: [], // 实时告警数据
    realTimeAbnormalTotal: 0,
    latestTopFault: [], // 最新TOP故障
    abnormalLevelCount: [], // 实时告警统计
    historyAbnormalList: [], // 历史告警
    historyAbnormalTotal: 0, // 历史告警总数
    maintainStrategyList: [], // 维护期策略
    maintainStrategyTotal: 0, // 维护期策略总数
    maintainType: [
      {
        value: 1,
        label: '新建'
      },
      {
        value: 2,
        label: '维护'
      },
      {
        value: 3,
        label: '扩建'
      },
      {
        value: 4,
        label: '割接'
      },
      {
        value: 5,
        label: '其他'
      }
    ],
    fmsList: [], // 故障维护策略
    fmsTotal: 0
  },
  mutations: {
    setWarningNumber (state, number) {
      state.warningNumber = number
    },
    setRealTimeAbnormalTotal (state, number) {
      state.realTimeAbnormalTotal = number
    },
    setRealTimeAlarmList (state, data) {
      state.realTimeAlarmList = data
    },
    setLatestTopFault (state, data) {
      state.latestTopFault = data
    },
    setAbnormalLevelCount (state, data) {
      state.abnormalLevelCount = data
    },
    setHistoryAbnormalList (state, data) {
      state.historyAbnormalList = data
    },
    setHistoryAbnormalTotal (state, number) {
      state.historyAbnormalTotal = number
    },
    setMaintainStrategyList (state, data) {
      state.maintainStrategyList = data
    },
    setMaintainStrategyTotal (state, number) {
      state.maintainStrategyTotal = number
    },
    setFmsList (state, data) {
      state.fmsList = data
    },
    setFmsTotal (state, number) {
      state.fmsTotal = number
    }
  },
  actions: {
    // 获取实时告警列表
    getRealTimeAlarmList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .getRealTimeAlarmList(params)
          .then(res => {
            console.log('===实时告警列表===', res)
            const { data } = res
            commit('setWarningNumber', data.total)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取实时告警列表
    getRealTimeAbnormal ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .getRealTimeAlarmList(params)
          .then(res => {
            console.log('===实时告警列表（页面）===', res)
            const { data } = res
            commit('setRealTimeAbnormalTotal', data.total)
            data.list.map(item => (item.selected = false))
            commit('setRealTimeAlarmList', data.list)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取最新TOP故障
    getLatestTopFault ({ commit }) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .getLatestTopFault()
          .then(res => {
            console.log('===最新TOP故障===', res)
            const { data } = res
            commit('setLatestTopFault', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取告警等级数量统计
    getAbnormalLevelCount ({ commit }) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .getAbnormalLevelCount()
          .then(res => {
            console.log('===告警统计===', res)
            const { data } = res
            commit('setAbnormalLevelCount', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 确认告警
    confirmAbnormal ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .confirmAbnormal(params)
          .then(res => {
            console.log('===告警确认===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 清除告警
    cleanAbnormal ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .cleanAbnormal(params)
          .then(res => {
            console.log('===告警清除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除告警
    deleteAbnormal ({ commit }, id) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .deleteAbnormal(id)
          .then(res => {
            console.log('===告警删除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取历史告警统计
    getHistoryAbnormalList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .getHistoryAbnormalList(params)
          .then(res => {
            console.log('===历史告警===', res)
            const { data } = res
            commit('setHistoryAbnormalTotal', data.total)
            commit('setHistoryAbnormalList', data.list)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取维护期策略列表
    getMaintainStrategyList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .getMaintainStrategyList(params)
          .then(res => {
            console.log('===维护期策略===', res)
            const { data } = res
            commit('setMaintainStrategyList', data.list)
            commit('setMaintainStrategyTotal', data.total)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除维护期策略
    deleteMaintainStrategy ({ commit }, id) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .deleteMaintainStrategy(id)
          .then(res => {
            console.log('===维护期策略删除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 新增维护期策略
    addMaintainStrategy ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .addMaintainStrategy(params)
          .then(res => {
            console.log('===维护期策略新增===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 修改维护期策略
    updateMaintainStrategy ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .updateMaintainStrategy(params)
          .then(res => {
            console.log('===维护期策略修改===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 故障维护策略
    getFmsList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .getFmsList(params)
          .then(res => {
            console.log('===故障维护策略===', res)
            const { data } = res
            commit('setFmsList', data.list)
            commit('setFmsTotal', data.total)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 故障维护策略新增
    addFms ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .addFms(params)
          .then(res => {
            console.log('===故障维护策略新增===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 故障维护策略修改
    updateFms ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .updateFms(params)
          .then(res => {
            console.log('===故障维护策略修改===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 故障维护策略删除
    deleteFms ({ commit }, id) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .deleteFms(id)
          .then(res => {
            console.log('===故障维护策略删除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
