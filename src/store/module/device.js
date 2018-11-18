/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:08:16
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-17 14:23:33
 * @desc: 设备类数据流
 */
import * as deviceApi from '@/api/device'
import { Notice } from 'iview'

export default {
  state: {
    deviceTree: {}, // 首页设备树
    currentDevice: null, // 当前终端设备id，只能是终端的
    currentRes: null, // 当前设备id，可以是终端的，也可以是终端子设备的
    deviceDetail: {}
  },
  mutations: {
    setdeviceTree (state, device) {
      state.deviceTree = device
    }
  },
  actions: {
    // 获取实时告警列表
    getDeviceTree ({ commit }) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getDeviceTree()
          .then(res => {
            console.log('===设备树===', res)
            if (res.msg !== 'success') return Notice.error({ title: res.msg })
            const { data } = res
            commit('setdeviceTree', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
