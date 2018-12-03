/*
 * @Author: chenghao
 * @Date: 2018-12-02 10:04:06
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-03 16:02:04
 * @Desc: 工单类接口
 */
import axios from '@/libs/api.request'

/**
 * 获取SLA工单考核
 */
export const getSLA = () => {
  return axios.request({
    url: '/api/woSla/wosla',
    method: 'get'
  })
}

/**
 *获取工单列表
 * @param {object} params
 */
export const getOrderList = params => {
  const {
    pageIndex = 1,
    pageSize = 10,
    wfTitle = '',
    resAbnormallevelName = '',
    userName = '',
    beginTime = '',
    endTime = '',
    currentUserName = '',
    resName = '',
    userId = '',
    currentUser = '',
    handleId = '',
    wfType = '',
    wfStatus = ''
  } = params
  return axios.request({
    url: '/api/workflow/pageList',
    method: 'get',
    params: {
      pageIndex,
      pageSize,
      wfTitle,
      resAbnormallevelName,
      userName,
      beginTime,
      endTime,
      currentUserName,
      resName,
      userId,
      currentUser,
      handleId,
      wfType,
      wfStatus
    }
  })
}

/**
 *保存工单
 * @param {object} params
 */
export const saveWorkFlow = params => {
  return axios.request({
    url: '/api/workflow/saveWorkFlow',
    method: 'post',
    data: params
  })
}

/**
 *提交工单（流程此刻已经开始）
 * @param {object} params
 */
export const startWorkFlow = params => {
  return axios.request({
    url: '/api/workflow/startWorkFlow',
    method: 'post',
    data: params
  })
}

/**
 * 获取所有工单处理组
 * @param {number} grpType
 * @param {number} pageIndex
 * @param {number} pageSize
 */
export const getWfGroup = (grpType = 2, pageIndex = 1, pageSize = 9999) => {
  return axios.request({
    url: '/api/sysGroup/pageList',
    method: 'get',
    params: {
      grpType,
      pageIndex,
      pageSize
    }
  })
}

/**
 *获取工单处理组下的用户
 * @param {*} grpId 用户组id
 */
export const getWfPeople = (grpId = '') => {
  return axios.request({
    url: '/api/sysUser/all',
    method: 'get',
    params: {
      grpId
    }
  })
}

/**
 *处理工单，此时工单已在流程了
 * @param {object} params
 */
export const handleWorkFlow = params => {
  return axios.request({
    url: '/api/workflow/handleWorkFlow',
    method: 'post',
    data: params
  })
}

/**
 *获取每个流程处理人
 * @param {object} params
 */
export const getWfUserList = params => {
  const { stepType = '', deptId = '' } = params
  return axios.request({
    url: '/api/sysUser/wfUserList',
    method: 'get',
    params: {
      stepType,
      deptId
    }
  })
}

/**
 * 删除工单，只有处在创建节点的工单可被删除
 * @param {number} businessId
 */
export const deleteWf = businessId => {
  return axios.request({
    url: `/api/workflow/${businessId}`,
    method: 'delete'
  })
}

/**
 * 获取维修工单评价人管理列表
 * @param {object} params
 */
export const getEvaluatorList = params => {
  const { pageIndex = 1, pageSize = 10, appraisertype = '', apprasiername = '', grpName = '' } = params
  return axios.request({
    url: `/api/repairOrderAppraiser/pageList`,
    method: 'get',
    params: {
      pageIndex,
      pageSize,
      appraisertype,
      apprasiername,
      grpName
    }
  })
}

/**
 *删除工单评价人
 * @param {array} ids
 */
export const deleteokGroupName = ids => {
  return axios.request({
    url: `/api/repairOrderAppraiser/`,
    method: 'delete',
    data: {
      appraiserids: ids
    }
  })
}
