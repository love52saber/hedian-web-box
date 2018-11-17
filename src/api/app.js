/*
 * @Author: chenghao
 * @Date: 2018-11-15 16:44:22
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-16 13:46:36
 * @desc: 系统应用信息
 */
import axios from '@/libs/api.request'

/**
 * 获取系统名称
 */
export const getAppName = () => {
  return axios.request({
    url: '/api/sysConf/10000/sys_name',
    method: 'get'
  })
}
