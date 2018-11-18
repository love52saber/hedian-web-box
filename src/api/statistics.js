/*
 * @Author: chenghao
 * @Date: 2018-11-17 14:24:36
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-18 15:01:57
 * @desc: 统计类接口
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
 * 获取设备状态统计
 */
export const getDeviceStatusList = () => {
  return axios.request({
    url: '/api/resStatus/getCountByStatus',
    method: 'get'
  })
}

/**
 * 获取设备等级统计
 */
export const getDeviceLevels = () => {
  return axios.request({
    url: '/api/resAbnormallevel/getCountByLevel',
    method: 'get'
  })
}

/**
 * 获取故障设备统计
 * @param {*} limit 条数
 * @param {*} offset 偏移量
 */
export const getTopFaultDeviceStatistics = (limit = 5, offset = 0) => {
  return axios.request({
    url: '/api/resBase/getTopRes',
    method: 'get',
    params: {
      limit,
      offset
    }
  })
}

/**
 * 获取Top故障统计
 */
export const getTopFaultStatistics = () => {
  return axios.request({
    url: '/api/resMoAbnormalInfo/getTopAbnormal',
    method: 'get'
  })
}
