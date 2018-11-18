/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:09:02
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-18 15:04:11
 * @desc: 告警类数据流
 */
import * as statisticsApi from '@/api/statistics'
import { Notice } from 'iview'

export default {
  state: {
    levels: [], // 设备告警等级统计
    statusList: [], // 报警状态统计
    topFaultDeviceStatistics: [], // top故障设备统计
    topFaultStatistics: [] // top故障统计
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
    }
  },
  actions: {
    getDeviceLevels ({ commit }) {
      return new Promise((resolve, reject) => {
        statisticsApi
          .getDeviceLevels()
          .then(res => {
            // console.log('===获取告警等级统计===', res)
            if (res.msg !== 'success') return Notice.error({ title: res.msg })
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
            if (res.msg !== 'success') return Notice.error({ title: res.msg })
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
            if (res.msg !== 'success') return Notice.error({ title: res.msg })
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
            console.log('===Top故障统计===', res)
            if (res.msg !== 'success') return Notice.error({ title: res.msg })
            const { data } = res
            commit('setTopFaultStatistics', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
