/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:09:02
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-28 15:29:24
 * @desc: 告警类数据流
 */
import * as abnormalApi from '@/api/abnormal'

export default {
  state: {
    warningNumber: 0, // 实时告警数目，用于header中的badge数字
    realTimeAlarmList: [], // 实时告警数据
    realTimeAbnormalTotal: 0,
    latestTopFault: [], // 最新TOP故障
    abnormalLevelCount: [] // 实时告警统计
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
            commit('setLatestTopFault', data.list)
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
    }
  }
}
