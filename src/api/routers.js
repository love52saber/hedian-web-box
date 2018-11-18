/*
 * @Author: chenghao
 * @Date: 2018-11-17 10:17:55
 * @Last Modified by:   chenghao
 * @Last Modified time: 2018-11-17 10:17:55
 * @desc: 路由类接口
 */
import axios from '@/libs/api.request'

export const getRouterReq = access => {
  return axios.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}
