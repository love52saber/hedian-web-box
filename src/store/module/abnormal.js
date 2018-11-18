/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:09:02
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-18 13:05:48
 * @desc: 告警类数据流
 */
import * as abnormalApi from '@/api/abnormal'
import { Notice } from 'iview'

export default {
  state: {
    warningNumber: 0, // 实时告警数目
    realTimeAlarmList: [], // 实时告警数据
    latestTopFault: [], // 最新TOP故障
    levels: [] // 设备告警等级统计
  },
  mutations: {
    setWarningNumber (state, number) {
      state.warningNumber = number
    },
    setRealTimeAlarmList (state, data) {
      state.realTimeAlarmList = data
    },
    setLatestTopFault (state, data) {
      state.latestTopFault = data
    }
  },
  actions: {
    // 获取实时告警列表
    getRealTimeAlarmList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        abnormalApi
          .getRealTimeAlarmList(params)
          .then(res => {
            // console.log('===实时告警列表===', res)
            if (res.msg !== 'success') return Notice.error({ title: res.msg })
            const { data } = res
            commit('setWarningNumber', data.total)
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
            if (res.msg !== 'success') return Notice.error({ title: res.msg })
            const { data } = res
            commit('setLatestTopFault', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
