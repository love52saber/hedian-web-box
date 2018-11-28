/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:09:02
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-27 16:10:41
 * @desc: 告警类数据流
 */
import * as statisticsApi from '@/api/statistics'

export default {
  state: {
    levels: [], // 设备告警等级统计
    statusList: [], // 报警状态统计
    topFaultDeviceStatistics: [], // top故障设备统计
    topFaultStatistics: [], // top故障统计
    faultDefinition: [], // 故障定义列表
    abnormalLevel: [], // 故障等级
    abnormalType: [] // 故障类型
  },
  mutations: {
    setLevels (state, data) {
      state.levels = data
    },
    setStatusList (state, data) {
      state.statusList = data
    },
    setTopFaultDeviceStatistics (state, data) {
      state.topFaultDeviceStatistics = data
    },
    setTopFaultStatistics (state, data) {
      state.topFaultStatistics = data
    },
    setFaultDefinition (state, data) {
      state.faultDefinition = data
    },
    setAbnormalLevel (state, data) {
      state.abnormalLevel = data
    },
    setAbnormalType (state, data) {
      state.abnormalType = data
    }
  },
  actions: {
    getDeviceLevels ({ commit }) {
      return new Promise((resolve, reject) => {
        statisticsApi
          .getDeviceLevels()
          .then(res => {
            // console.log('===获取告警等级统计===', res)
            const { data } = res
            commit('setLevels', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getDeviceStatusList ({ commit }) {
      return new Promise((resolve, reject) => {
        statisticsApi
          .getDeviceStatusList()
          .then(res => {
            // console.log('===获取设备状态统计===', res)
            const { data } = res
            commit('setStatusList', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getTopFaultDeviceStatistics ({ commit }) {
      return new Promise((resolve, reject) => {
        statisticsApi
          .getTopFaultDeviceStatistics()
          .then(res => {
            // console.log('===Top故障设备统计===', res)
            const { data } = res
            commit('setTopFaultDeviceStatistics', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getTopFaultStatistics ({ commit }) {
      return new Promise((resolve, reject) => {
        statisticsApi
          .getTopFaultStatistics()
          .then(res => {
            // console.log('===Top故障统计===', res)
            const { data } = res
            commit('setTopFaultStatistics', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getFaultDefinition ({ commit }, params) {
      return new Promise((resolve, reject) => {
        statisticsApi
          .getFaultDefinition(params)
          .then(res => {
            res.data.list.forEach(item => {
              item.selected = false
            })
            console.log('===故障定义===', res)
            commit('setFaultDefinition', res.data.list)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getAbnormalLevel ({ commit }) {
      return new Promise((resolve, reject) => {
        statisticsApi
          .getAbnormalLevel()
          .then(res => {
            console.log('===获取故障等级===', JSON.stringify(res.data))
            commit('setAbnormalLevel', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getAbnormalType ({ commit }) {
      return new Promise((resolve, reject) => {
        statisticsApi
          .getAbnormalType()
          .then(res => {
            // console.log('===获取故障类型===', JSON.stringify(res.data))
            commit('setAbnormalType', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
