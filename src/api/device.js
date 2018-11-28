/*
 * @Author: chenghao
 * @Date: 2018-11-17 10:15:50
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-27 16:56:16
 * @desc: 设备资源类接口
 */
import axios from '@/libs/api.request'

/**
 * 获取设备树
 */
export const getDeviceTree = () => {
  return axios.request({
    url: '/api/resBase/getResTree',
    method: 'get'
  })
}

/**
 *获取终端信息
 *
 * @export
 * @param {*} resId 设备ID
 * @returns
 */
export const getDeviceDetail = resId => {
  return axios.request({
    url: `/api/resBase/getResBaseInfos/${resId}`,
    method: 'get'
  })
}

/**
 *获取设备告警信息
 *
 * @export
 * @param {*} resId 设备ID
 * @returns
 */
export const getDeviceAlarm = resId => {
  return axios.request({
    url: `/api/resMoAbnormalInfo/selectAlarmByResid/${resId}`,
    method: 'get'
  })
}

/**
 * 获取维护域分页数据
 * @param {*} params 参数对象
 */
export const getMaintainDomainList = params => {
  const { pageIndex = 1, info = '', pageSize = 15 } = params
  return axios.request({
    url: '/api/md/pageList',
    method: 'get',
    params: {
      pageIndex,
      info,
      pageSize
    }
  })
}

/**
 * 删除维护域
 * @param {number} mdId 维护域id
 */
export const deleteMaintainDomain = mdId => {
  return axios.request({
    url: `/api/md/${mdId}`,
    method: 'delete'
  })
}

/**
 * 新增维护域
 * @param {*} params 参数对象
 */
export const addMaintainDomain = params => {
  return axios.request({
    url: '/api/md/',
    method: 'post',
    data: params
  })
}

/**
 * 修改维护域
 * @param {*} params 参数对象
 */
export const updateMaintainDomain = params => {
  return axios.request({
    url: '/api/md/',
    method: 'put',
    data: params
  })
}

/**
 * 获取资源主类型列表
 */
export const getMainTypeList = () => {
  return axios.request({
    url: '/api/resMaintype/all',
    method: 'get'
  })
}

/**
 * 获取资源子类型数据
 * @param {number} resMtype 主类型id
 */
export const getSubTypeList = (resMtype = '') => {
  return axios.request({
    url: '/api/resSubtype/treeAll',
    method: 'get',
    params: {
      resMtype
    }
  })
}

/**
 * 获取资源列表（控件）
 * @param {*} params 参数对象
 * @param {*} resName 资源名称
 * @param {*} resStype 子类型
 * @param {*} resIPV4 ip地址
 * @param {*} resSerialnumber 序列号
 * @param {*} resAddress  地址
 * @param {*} resMtype 主类型
 */
export const getResList = params => {
  const {
    resName = '',
    resStype = params.resSubtype ? params.resSubtype : '',
    resIpv4 = '',
    resSerialnumber = '',
    resAddress = '',
    resMtype = params.resMainType ? params.resMainType : ''
  } = params
  return axios.request({
    url: '/api/resBase/pageList',
    method: 'get',
    params: {
      resName,
      resStype,
      resIpv4,
      resSerialnumber,
      resAddress,
      resMtype,
      pageIndex: 1,
      pageSize: 99999
    }
  })
}

/**
 * 获取监控指标列表（页面）
 * @param {*} params
 */
export const getMoKpiList = params => {
  const { info = '', pageIndex = 1, pageSize = 15 } = params
  return axios.request({
    url: '/api/moKpi/pageList',
    method: 'get',
    params: { info, pageIndex, pageSize }
  })
}

/**
 * 删除监控指标
 * @param {*} params
 */
export const deleteMoKpi = mokpiId => {
  return axios.request({
    url: `/api/moKpi/${mokpiId}`,
    method: 'delete'
  })
}

/**
 * 新增监控指标
 * @param {*} params
 */
export const addMoKpi = params => {
  return axios.request({
    url: '/api/moKpi/',
    method: 'post',
    data: params
  })
}

/**
 * 修改监控指标
 * @param {*} params
 */
export const updateMoKpi = params => {
  return axios.request({
    url: '/api/moKpi/',
    method: 'put',
    data: params
  })
}

/**
 * 获取监控对象
 * @param {*} resStype 资源子类型id
 */
export const getKpiObjectList = (resStype = '') => {
  return axios.request({
    url: '/api/moKpi/allMokpiObject',
    method: 'get',
    params: {
      resStype
    }
  })
}

/**
 * 删除监控对象
 * @param {number} skId 监控对象id
 */
export const deleteKpiObject = (skId = '') => {
  return axios.request({
    url: `/api/resStypeKpi/${skId}`,
    method: 'delete'
  })
}

/**
 *新增监控对象
 * @param {object} params 参数对象
 */
export const addKpiObject = params => {
  return axios.request({
    url: `/api/resStypeKpi`,
    method: 'post',
    data: params
  })
}

/**
 *修改监控对象
 * @param {object} params 参数对象
 */
export const updateKpiObject = params => {
  return axios.request({
    url: `/api/resStypeKpi`,
    method: 'put',
    data: params
  })
}

/**
 * 获取阈值规则列表
 * @param {object} params
 */
export const getThresholdList = params => {
  const {
    pageIndex = 1,
    pageSize = 10,
    moKpiName = '',
    moAbnormalName = '',
    resStypeName = '',
    resMtypeName = ''
  } = params
  return axios.request({
    url: `/api/moThreshold/pageList`,
    method: 'get',
    params: { pageIndex, pageSize, moKpiName, moAbnormalName, resStypeName, resMtypeName }
  })
}

/**
 *删除阈值规则
 * @param {number} id
 */
export const deleteThreshold = id => {
  return axios.request({
    url: `/api/moThreshold/${id}`,
    method: 'delete'
  })
}

/**
 *新增阈值规则
 * @param {object} params
 */
export const addThreshold = params => {
  return axios.request({
    url: `/api/moThreshold`,
    method: 'post',
    data: {
      ...params,
      showorder: 100
    }
  })
}

/**
 *修改阈值规则
 * @param {object} params
 */
export const updateThreshold = params => {
  return axios.request({
    url: `/api/moThreshold`,
    method: 'put',
    data: {
      ...params,
      showorder: 100
    }
  })
}

/**
 * 获取监控指标（控件）
 * @param {*} resStype 子类型id
 */
export const kpiInCtrl = (resStype = '') => {
  return axios.request({
    url: `/api/moKpi/all`,
    method: 'get',
    params: {
      resStype
    }
  })
}
