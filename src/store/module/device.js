/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:08:16
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-20 10:49:36
 * @desc: 设备类数据流
 */
import * as deviceApi from '@/api/device'

export default {
  state: {
    center: [33.68573, 119.795338], // 地图默认中心点阜宁县
    deviceTree: {}, // 首页设备树
    currentDevice: null, // 当前终端设备id，只能是终端的
    currentRes: null, // 当前设备id，可以是终端的，也可以是终端子设备的
    deviceDetail: {}, // 设备详情
    deviceList: [] // 设备列表，用于地图上打点的数据
  },
  mutations: {
    setDeviceTree (state, device) {
      state.deviceTree = device
    },
    setCurrentDevice (state, id) {
      state.currentDevice = id
    },
    setCurrentRes (state, id) {
      state.currentRes = id
    },
    pushDeviceList (state, data) {
      state.deviceList.push(data)
    },
    setDeviceList (state, data) {
      state.deviceList = data
    },
    setCenter (state, data) {
      // 更新页面中心点
      const deviceList = state.deviceList
      const device = deviceList.find(item => item.resId === data)
      deviceList.forEach(currentItem => {
        currentItem.selected = false
        currentItem.iconSize = [20, 20]
        currentItem.iconAnchor = [10, 10]
      })
      device.selected = true
      device.iconSize = [40, 40]
      device.iconAnchor = [10, 10]
      state.center = [device.latitude, device.longitude]
    },
    setDeviceDetail (state, data) {
      state.deviceDetail = data
    }
  },
  actions: {
    // 获取设备树
    getDeviceTree ({ commit }) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getDeviceTree()
          .then(res => {
            // console.log('===设备树===', res)
            const { data } = res
            if (data) commit('setDeviceTree', data) && commit('setDeviceTree', [])
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getDeviceDetail ({ commit }, resId) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getDeviceDetail(resId)
          .then(res => {
            // console.log('===终端设备详情===', res)
            const { data } = res
            if (data) commit('setDeviceDetail', Object.values(data)[0])
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
