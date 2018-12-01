/*
 * @Author: chenghao
 * @Date: 2018-12-01 16:11:05
 * @Last Modified by:   chenghao
 * @Last Modified time: 2018-12-01 16:11:05
 */
import axios from 'axios'
import { getToken, setToken } from '@/libs/util'
import _ from 'lodash'
import $router from '@/router'
import { Notice } from 'iview'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      timeout: window.config.TIME_OUT,
      withCredentials: true,
      headers: {
        common: {}
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        config.headers.common['Authorization'] = getToken()
        switch (config.method) {
          case 'post':
          case 'put':
            config.headers['Content-Type'] = 'application/json'
            _.forIn(config.data, (value, key) => {
              config.data[key] = typeof value === 'string' ? value.replace(/"/, '') : value
            })
            break
          case 'get':
            config.url = encodeURI(config.url)
            config.params = {
              ...config.params
            }
            break
          default:
            break
        }
        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url)
        if (res.data && res.data.msg !== 'success') {
          Notice.error({ title: res.data.msg, desc: `${res.data.msg}` })
        }
        return res.data
      },
      error => {
        this.destroy(url)
        if (!error.response) return Notice.error({ title: '请求超时' })
        // console.log('===error===', JSON.stringify(error))
        switch (error.response.status) {
          case 401:
            Notice.destroy()
            Notice.error({ title: '会话超时，请重新登录', desc: `会话超时，请重新登录` })
            setToken('')
            $router.push({
              name: 'login'
            })
            break
          case 500:
            Notice.error({ title: '服务端异常', desc: `服务端发生异常,异常的接口地址为${error.response.data.path}` })
            break
          default:
            break
        }
        return Promise.reject(error)
      }
    )
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
