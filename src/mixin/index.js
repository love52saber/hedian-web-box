/*
 * @Author: chenghao
 * @Date: 2018-11-30 16:59:20
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-11-30 17:01:39
 * @Desc: 长度控制混入
 */
export default {
  data () {
    return {
      NAME_LENGTH_LIMIT: window.config.NAME_LENGTH_LIMIT,
      DESC_LENGTH_LIMIT: window.config.DESC_LENGTH_LIMIT
    }
  }
}
