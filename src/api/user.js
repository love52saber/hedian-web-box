/*
 * @Author: chenghao
 * @Date: 2018-11-17 10:17:33
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-23 10:44:22
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

/**
 * 获取角色列表
 * @param {*} params 参数对象
 */
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

/**
 * 获取全部角色列表
 */
export const getAllRoleList = () => {
  return axios.request({
    url: `/api/sysRole/all`,
    method: 'get'
  })
}

/**
 * 获取菜单权限 系统管理=>安全管理=>角色管理
 */
export const getMenuTreeData = () => {
  return axios.request({
    url: '/api/sysMenu/all',
    method: 'get'
  })
}

/**
 * 角色新增
 * @param {*} params 新增参数
 */
export const addRole = params => {
  return axios.request({
    url: '/api/sysRole/',
    method: 'post',
    data: params
  })
}

/**
 * 角色修改
 * @param {*} params 新增参数
 */
export const updateRole = params => {
  return axios.request({
    url: '/api/sysRole/',
    method: 'put',
    data: params
  })
}

/**
 * 角色删除
 * @param {*} roleId 角色id
 */
export const deleteRole = roleId => {
  return axios.request({
    url: `/api/sysRole/${roleId}`,
    method: 'delete'
  })
}

/**
 * 获取用户列表
 * @param {*} params
 */
export const getUserList = params => {
  const { deptId = '', pageIndex = 1, info = '', pageSize = 15 } = params
  return axios.request({
    url: '/api/sysUser/pageList',
    method: 'get',
    params: { deptId, pageIndex, info, pageSize }
  })
}

/**
 * 新增用户
 * @param {*} params
 */
export const addUser = params => {
  return axios.request({
    url: '/api/sysUser/',
    method: 'post',
    data: params
  })
}

/**
 * 修改用户
 * @param {*} params
 */
export const updateUser = params => {
  return axios.request({
    url: '/api/sysUser/',
    method: 'put',
    data: params
  })
}

/**
 * 锁定/解锁用户
 * @param {*} userId 用户id
 * @param {*} isLock 锁定信息，lock为锁定，unlock为解锁
 */
export const lockUser = (userId, isLock) => {
  return axios.request({
    url: `/api/sysUser/lock/${userId}/${isLock}`,
    method: 'get'
  })
}

/**
 * 删除用户
 * @param {*} userId 用户id
 */
export const deleteUser = userId => {
  return axios.request({
    url: `/api/sysUser/${userId}`,
    method: 'delete'
  })
}

/**
 * 获取用户组列表 系统管理=>安全管理=>用户组管理
 * @param {*} params 参数对象
 */
export const getUserGroupList = params => {
  const { pageIndex = 1, grpName = '', pageSize = 15, grpType = '' } = params
  return axios.request({
    url: '/api/sysGroup/pageList',
    method: 'get',
    params: {
      pageIndex,
      pageSize,
      grpName,
      grpType
    }
  })
}

/**
 * 新增用户组
 * @param {*} params 参数对象
 */
export const addUserGroup = params => {
  return axios.request({
    url: '/api/sysGroup',
    method: 'post',
    data: params
  })
}

/**
 * 修改用户组
 * @param {*} params 参数对象
 */
export const updateUserGroup = params => {
  return axios.request({
    url: '/api/sysGroup',
    method: 'put',
    data: params
  })
}

/**
 * 删除用户组
 * @param {*} grpId 用户组id
 */
export const deleteUserGroup = grpId => {
  return axios.request({
    url: `/api/sysGroup/${grpId}`,
    method: 'delete'
  })
}
