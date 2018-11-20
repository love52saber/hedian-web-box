/*
 * @Author: chenghao
 * @Date: 2018-11-16 13:48:29
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-19 19:15:37
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
