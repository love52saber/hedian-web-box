import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import abnormal from './module/abnormal'
import device from './module/device'
import statistics from './module/statistics'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app,
    abnormal,
    device,
    statistics
  }
})
