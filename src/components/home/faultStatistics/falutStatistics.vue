<template>
  <info-card class="g_falut_statistics">
    <div slot="title" class="top-summary-title">
      <div class="tlt-item" :class="{'active': topChart=='device'}" @click="topChart='device'">TOP故障设备统计</div>
      <div class="tlt-item" :class="{'active': topChart=='fault'}" @click="topChart='fault'">TOP故障统计</div>
    </div>
    <div class="top-chart-container" v-show="topChart==='device'">
      <div v-if="!deviceChart.length" class="nodata">没有设备发生故障</div>
      <chart-bar v-show="deviceChart.length>0" ref="device" style="height: 200px;" :value="deviceChart" />
    </div>
    <div class="top-chart-container" v-show="topChart==='fault'">
      <div v-if="!faultChart.length" class="nodata">没有故障数据</div>
      <chart-bar v-show="faultChart.length>0" ref="fault" style="height: 200px;" :value="faultChart" />
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
      this.device.forEach((e, index) => {
        if (index < 5) { // 取前五数据展示
          chartData[e.resAlias || e.resName] = e.countNum
        }
      })
      return chartData
    },
    faultChart () {
      let chartData = {}
      this.fault.forEach((e, index) => {
        if (index < 5) { // 取前五数据展示
          chartData[e.moAbnormalName] = e.countNum
        }
      })
      return chartData
    }
  }
}
</script>
