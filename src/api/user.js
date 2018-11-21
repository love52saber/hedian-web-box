/*
 * @Author: chenghao
 * @Date: 2018-11-17 10:17:33
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-21 17:34:19
 * @desc：用户类接口
 */
import axios from '@/libs/api.request'

/**
 * 登录
 * @param {*} username 用户名
 * @param {*} password 密码
 */
export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: '/api/login',
    data,
    method: 'post'
  })
}

/**
 * 忘记密码
 */
export const forgotPassword = () => {
  return axios.request({
    url: '/api/sysConf/10000/Forget_Pwd',
    method: 'get'
  })
}

/**
 * 修改资料
 * @param {*} params 参数对象
 */
export const updateUserInfo = params => {
  return axios.request({
    url: '/api/sysUser/info',
    method: 'put',
    data: params
  })
}

/**
 * 修改密码
 * @param {*} params 参数对象
 */
export const updatePassword = params => {
  return axios.request({
    url: '/api/sysUser/updatePassword',
    method: 'put',
    data: params
  })
}

/**
 * 获取组织单位树 系统管理=>组织单位管理=>组织单位
 */
export const getOrganizationalUnit = () => {
  return axios.request({
    url: '/api/sysDept/treeAll',
    method: 'get'
  })
}

/**
 * 新增组织单位
 * @param {*} params 参数对象
 */
export const addUnit = params => {
  return axios.request({
    url: '/api/sysDept/',
    method: 'post',
    data: params
  })
}

/**
 * 修改组织单位
 * @param {*} params 参数对象
 */
export const updateUnit = params => {
  return axios.request({
    url: '/api/sysDept/',
    method: 'put',
    data: params
  })
}

/**
 * 删除组织单位
 * @param {*} deptId 部门id
 */
export const deleteUnit = deptId => {
  return axios.request({
    url: `/api/sysDept/${deptId}`,
    method: 'delete'
  })
}

export const getRoleList = params => {
  const { pageIndex = 1, pageSize = 15, info = '' } = params
  return axios.request({
    url: `/api/sysRole/pageList`,
    method: 'get',
    params: {
      pageIndex,
      pageSize,
      info
    }
  })
}
