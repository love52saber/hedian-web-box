/*
 * @Author: chenghao
 * @Date: 2018-11-17 10:15:50
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-17 10:25:49
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

// FIXME:确认这个接口是否在用
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
