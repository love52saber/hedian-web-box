import axios from 'axios'
import config from '../config'

let server = axios.create({
  baseURL: 'http://restapi.amap.com/v3',
  params: {
    key: config.AMAP_KEY
  },
  timeout: config.TIME_OUT,
  headers: {
    common: {}
  }
})

/**
 *
 *
 * @export 查询行政区边界
 * @param {*} keywords 查询关键字
 * @param {number} [subdistrict=0] 查询子级行政区
 * @param {string} [extensions='all'] 返回行政区边界坐标点
 * @returns promise
 */
export function getDistrictBounds (keywords, subdistrict = 0, extensions = 'all') {
  return new Promise((resolve, reject) => {
    server
      .get('/config/district', {
        params: {
          keywords,
          subdistrict,
          extensions
        }
      })
      .then(res => {
        const { data } = res
        if (data.status === '1') {
          resolve(data)
        } else {
          console.log(`status:${data.status},info:${data.info}`)
          reject(data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
}
