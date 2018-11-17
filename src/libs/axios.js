import axios from 'axios'
import { getToken } from '@/libs/util'
import $config from '@/config'
import _ from 'lodash'
// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      timeout: $config.TIME_OUT,
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
        return res.data
      },
      error => {
        this.destroy(url)
        console.log('===error===', JSON.stringify(error))
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
