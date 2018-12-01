/*
 * @Author: chenghao
 * @Date: 2018-12-01 16:11:00
 * @Last Modified by:   chenghao
 * @Last Modified time: 2018-12-01 16:11:00
 */
import HttpRequest from '@/libs/axios'
const baseUrl = window.config.baseUrl

const axios = new HttpRequest(baseUrl)
export default axios
