/*
 * @Author: chenghao
 * @Date: 2018-11-17 10:17:33
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-20 16:39:25
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
