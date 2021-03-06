/*
 * @Author: chenghao
 * @Date: 2018-11-15 16:44:22
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-17 10:17:27
 * @desc: 系统配置类接口
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
