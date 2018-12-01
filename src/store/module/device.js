/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:08:16
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-01 14:59:41
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
    deviceAlarm: [], // 设备详情中设备告警数据
    deviceList: [], // 设备列表，用于地图上打点的数据
    maintainDomainList: [], // 管理域列表
    mdTotal: 0, // 维护域总数
    maintainDomainInControls: [], // 管理域控件
    mainTypeList: [], // 资源主类型列表
    subTypeList: [], // 资源子类型列表
    resList: [], // 资源列表
    moKpiList: [], // 监测指标列表
    moKpiTotal: 0, // 指标总数
    kpiObjectList: [], // 监控对象列表
    thresholdList: [], // 阈值规则列表
    thresholdTotal: 0, // 阈值规则总数
    kpiInCtrl: [] // 监控指标（控件）
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
    },
    setDeviceAlarm (state, data) {
      state.deviceAlarm = data
    },
    setMaintainDomainList (state, data) {
      state.maintainDomainList = data
    },
    setMaintainDomainInControls (state, data) {
      state.maintainDomainInControls = data
    },
    setMdTotal (state, num) {
      state.mdTotal = num
    },
    setMainTypeList (state, data) {
      state.mainTypeList = data
    },
    setSubTypeList (state, data) {
      state.subTypeList = data
    },
    setResList (state, data) {
      state.resList = data
    },
    setMoKpiList (state, data) {
      state.moKpiList = data
    },
    setMoKpiTotal (state, num) {
      state.moKpiTotal = num
    },
    setKpiObjectList (state, data) {
      state.kpiObjectList = data
    },
    setThresholdList (state, data) {
      state.thresholdList = data
    },
    setThresholdTotal (state, num) {
      state.thresholdTotal = num
    },
    setKpiInCtrl (state, data) {
      state.kpiInCtrl = data
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
    },
    getDeviceAlarm ({ commit }, resId) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getDeviceAlarm(resId)
          .then(res => {
            console.log('===详情设备告警===', res)
            const { data } = res
            if (data) commit('setDeviceAlarm', data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 维护域列表（页面）
    getMaintainDomainList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getMaintainDomainList(params)
          .then(res => {
            console.log('===维护域列表（页面）===', res)
            commit('setMaintainDomainList', res.data.list)
            const { total = 0 } = res.data
            commit('setMdTotal', total)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getMaintainDomainInControls ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getMaintainDomainInControls(params)
          .then(res => {
            console.log('===维护域列表（控件）===', res)
            res.data.forEach(item => {
              item.selected = false
            })
            commit('setMaintainDomainInControls', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 新增维护域
    addMaintainDomain ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .addMaintainDomain(params)
          .then(res => {
            console.log('===维护域新增===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 修改维护域
    updateMaintainDomain ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .updateMaintainDomain(params)
          .then(res => {
            console.log('===维护域修改===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除维护域
    deleteMaintainDomain ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .deleteMaintainDomain(params)
          .then(res => {
            console.log('===维护域删除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取资源主类型
    getMainTypeList ({ commit }) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getMainTypeList()
          .then(res => {
            // console.log('===资源主类型数据===', res)
            commit('setMainTypeList', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取资源子类型
    getSubTypeList ({ commit }, resMtype) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getSubTypeList(resMtype)
          .then(res => {
            // console.log('===资源子类型数据===', res)
            commit('setSubTypeList', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取资源列表
    getResList ({ commit }, params) {
      deviceApi
        .getResList(params)
        .then(res => {
          // console.log('===资源列表===', res)
          if (res.msg === 'success') {
            res.data.list.forEach(item => {
              item.selected = false
            })
            commit('setResList', res.data.list)
          }
        })
        .catch(err => {
          reject(err)
        })
    },
    // 获取监控指标
    getMoKpiList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getMoKpiList(params)
          .then(res => {
            console.log('===监测指标列表（页面）===', res)
            commit('setMoKpiList', res.data.list)
            const { total = 0 } = res.data
            commit('setMoKpiTotal', total)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 新增监控指标
    addMoKpi ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .addMoKpi(params)
          .then(res => {
            console.log('===指标新增===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 修改监控指标
    updateMoKpi ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .updateMoKpi(params)
          .then(res => {
            console.log('===指标修改===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除指标
    deleteMoKpi ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .deleteMoKpi(params)
          .then(res => {
            console.log('===指标删除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取监控对象列表
    getKpiObjectList ({ commit }, resStype) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getKpiObjectList(resStype)
          .then(res => {
            console.log('===监测对象列表（页面）===', res)
            commit('setKpiObjectList', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除监控对象
    deleteKpiObject ({ commit }, skId) {
      return new Promise((resolve, reject) => {
        deviceApi
          .deleteKpiObject(skId)
          .then(res => {
            console.log('===监控对象删除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 修改监控对象
    updateKpiObject ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .updateKpiObject(params)
          .then(res => {
            console.log('===监控对象修改===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 新增监控对象
    addKpiObject ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .addKpiObject(params)
          .then(res => {
            console.log('===监控对象新增===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取监控指标
    getThresholdList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .getThresholdList(params)
          .then(res => {
            console.log('===阈值规则列表（页面）===', res)
            commit('setThresholdList', res.data.list)
            const { total = 0 } = res.data
            commit('setThresholdTotal', total)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    kpiInCtrl ({ commit }, resStype) {
      return new Promise((resolve, reject) => {
        deviceApi
          .kpiInCtrl(resStype)
          .then(res => {
            console.log('===获取监控指标（控件）===', res)
            commit('setKpiInCtrl', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    addThreshold ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .addThreshold(params)
          .then(res => {
            console.log('===阈值规则新增===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    updateThreshold ({ commit }, params) {
      return new Promise((resolve, reject) => {
        deviceApi
          .updateThreshold(params)
          .then(res => {
            console.log('===阈值规则修改===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    deleteThreshold ({ commit }, thId) {
      return new Promise((resolve, reject) => {
        deviceApi
          .deleteThreshold(thId)
          .then(res => {
            console.log('===阈值规则删除===', res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
