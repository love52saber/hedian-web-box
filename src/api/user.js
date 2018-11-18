/*
 * @Author: chenghao
 * @Date: 2018-11-17 10:17:33
 * @Last Modified by:   chenghao
 * @Last Modified time: 2018-11-17 10:17:33
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
 * 退出系统
 */
export const logout = () => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
