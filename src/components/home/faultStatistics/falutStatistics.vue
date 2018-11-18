<template>
  <info-card class="g_falut_statistics">
    <div slot="title" class="top-summary-title">
      <div class="tlt-item" :class="{'active': topChart=='device'}" @click="topChart='device'">TOP故障设备统计</div>
      <div class="tlt-item" :class="{'active': topChart=='fault'}" @click="topChart='fault'">TOP故障统计</div>
    </div>
    <div class="top-chart-container" v-show="topChart==='device'">
      <chart-bar ref="device" style="height: 200px;" :value="deviceChart" />
    </div>
    <div class="top-chart-container" v-show="topChart==='fault'">
      <chart-bar ref="fault" style="height: 200px;" :value="faultChart" />
    </div>
  </info-card>
</template>
<script>
import InfoCard from '_c/card'
import { ChartBar } from '_c/charts'
import './faultStatistics.less'
export default {
  name: 'FaultStatistics',
  components: {
    InfoCard,
    ChartBar
  },
  props: {
    fault: {
      type: Array,
      default: () => []
    },
    device: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      topChart: 'device'
    }
  },
  mounted () {
    this.$watch('topChart', () => {
      this.$nextTick(() => {
        this.$refs[this.topChart].resize()
      })
    })
  },
  computed: {
    deviceChart () {
      let chartData = {}
      this.device.forEach(e => {
        chartData[e.resAlias || e.resName] = e.countNum
      })
      return chartData
    },
    faultChart () {
      let chartData = {}
      this.fault.forEach(e => {
        chartData[e.moAbnormalName] = e.countNum
      })
      return chartData
    }
  }
}
</script>
