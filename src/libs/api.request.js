import HttpRequest from '@/libs/axios'
const baseUrl = window.config.baseUrl

const axios = new HttpRequest(baseUrl)
export default axios
