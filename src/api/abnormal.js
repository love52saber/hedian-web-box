/*
 * @Author: chenghao
 * @Date: 2018-11-16 13:48:29
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-28 15:36:58
 * @desc: 警告类接口
 */
import axios from '@/libs/api.request'

/**
 * 获取实时告警列表
 * @param {*} params 参数对象
 */
export const getRealTimeAlarmList = params => {
  const defaultParams = {
    pageIndex: 1, // 页码
    pageSize: 10, // 每页长度
    beginTime: '', // 开始时间
    endTime: '', // 结束时间
    conStatus: '', // 确认状态
    abnormalLevel: '', // 告警等级
    abnormalType: '', // 告警类型
    abnormalName: '', // 告警名称
    mokpiName: '', // 指标名称
    resName: '', // 资源名称
    resAlias: '', // 资源别名
    resAbnormalId: '', // 告警id
    resId: '', // 资源id
    isAutoOrder: false // 已派单
  }
  return axios.request({
    url: '/api/resMoAbnormalInfo/pageList',
    method: 'get',
    params: {
      ...defaultParams,
      ...params
    }
  })
}

/**
 * 获取最新Top故障
 */
export const getLatestTopFault = () => {
  return axios.request({
    url: '/api/resMoAbnormalInfo/pageList',
    method: 'get',
    params: {
      pageIndex: 1, // 页码
      pageSize: 5, // 每页长度
      isAutoOrder: false // 已派单
    }
  })
}

/**
 * 获取历史告警列表
 * @param {object} params
 */
export const getHistoryAbormalList = params => {
  const {
    pageIndex = 1,
    pageSize = 10,
    beginTime = '',
    endTime = '',
    abnormalLevel = '',
    abnormalType = '',
    abnormalName = '',
    mokpiName = '',
    resName = '',
    resAlias = '',
    isAutoOrder = false,
    useflag = false
  } = params
  return axios.request({
    url: '/api/resMoAbnormalInfoH/pageList',
    method: 'get',
    params: {
      pageIndex,
      pageSize,
      beginTime,
      endTime,
      abnormalLevel,
      abnormalType,
      abnormalName,
      mokpiName,
      resName,
      resAlias,
      isAutoOrder,
      useflag
    }
  })
}

/**
 *删除告警
 * @param {number} id 告警id
 */
export const deleteAbnormal = id => {
  return axios.request({
    url: `/api/resMoAbnormalInfo/${id}`,
    method: 'delete'
  })
}

/**
 * 获取实时告警页面内的数量统计
 */
export const getAbnormalLevelCount = () => {
  return axios.request({
    url: '/api/resMoAbnormalInfo/abnormalLevelCount',
    method: 'get'
  })
}

/**
 *确认告警
 * @param {object} params
 * resAbnormalId， confirmInfo
 */
export const confirmAbnormal = params => {
  return axios.request({
    url: `/api/resMoAbnormalInfo/confirmAbnormal`,
    method: 'put',
    data: params
  })
}

/**
 *清除告警
 * @param {object} params
 * resAbnormalId， cleanInfo
 */
export const cleanAbnormal = params => {
  return axios.request({
    url: `/api/resMoAbnormalInfo/cleanAbnormal`,
    method: 'put',
    data: params
  })
}
