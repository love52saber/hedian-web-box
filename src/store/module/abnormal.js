import * as abnormalApi from '@/api/abnormal'
import { Notice } from 'iview'

export default {
  state: {
    warningNumber: 0, // 实时告警数目
    realTimeAlarmList: [] // 实时告警数据
  },
  mutations: {
    setWarningNumber (state, number) {
      state.warningNumber = number
    },
    setRealTimeAlarmList (state, data) {
      state.realTimeAlarmList = data
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
            if (res.msg !== 'success') return Notice.info({ title: res.msg })
            const { data } = res
            commit('setWarningNumber', data.total)
            commit('setRealTimeAlarmList', data.list)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
