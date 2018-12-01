<style lang="less" scoped>
.box-container {
  width: 600px;
  height: 300px;
  .device-name {
    color: #ffffff;
    font-size: 16px;
    text-align: center;
  }
}
</style>

<template>
  <div class="box-container">
    <div class="device-name">{{this.name}}</div>
    <device-chart :value="option" style="height:300px" />
  </div>
</template>

<script>
import { DeviceChart } from '_c/charts'
export default {
  data () {
    return {
      // config
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      default: '终端'
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    option () { // 功率，电压，电流数据装配，若超过默认最大值则覆盖默认最大值
      const indexToTarget = {
        0: ['power', window.config.VUE_APP_DEFAULT_POWER_MAX],
        1: ['voltage', window.config.VUE_APP_DEFAULT_VOLTAGE_MAX],
        2: ['current', window.config.VUE_APP_DEFAULT_CURRENT_MAX]
      }
      const data = []
      for (let i = 0; i < Object.keys(indexToTarget).length; i++) {
        data.push({
          value: ~~this.data[indexToTarget[i][0]] || 0,
          max: this.data[indexToTarget[i][0]] > indexToTarget[i][1] ? ~~this.data[indexToTarget[i][0]] : indexToTarget[i][1]
        })
      }
      return data
    }
  },
  components: {
    DeviceChart
  }
}
</script>
