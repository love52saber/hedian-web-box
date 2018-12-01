<template>
  <info-card class="g_alarm_statistics" title="报警统计">
    <span slot="extra" v-text="currentTime"></span>
    <chart-pie style="height: 120px;" :value="chart" />
    <span>设备统计: {{summary}}</span>
    <ul class="m_level_list">
      <li v-for="item in levels" :key="item.resAbnormallevelId" class="u_level_item">
        <Icon size="22" style="margin-right:8px;" :color="item.resAbnormallevelColor" type="md-notifications-outline"></Icon>
        {{item.resAbnormallevelName}}：
        <strong>{{item.countNum}}</strong> 台
      </li>
    </ul>
  </info-card>
</template>
<script>
import InfoCard from '_c/card'
import { ChartPie } from '_c/charts'
import { pieData } from '_c/charts/defaultData'
import day from 'dayjs'
import _ from 'lodash'
import './alarmStatistics.less'
export default {
  name: 'AlarmStatistics', // 主页右上角报警统计
  components: {
    InfoCard,
    ChartPie
  },
  props: {
    levels: {
      type: Array,
      default: () => []
    },
    status: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
    currentTime () {
      return day(_.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    total () {
      return this.status.reduce((accumulator, current) => accumulator + current.countNum, 0)
    },
    summary () {
      let s = [`总数${this.total}台`]
      this.status.forEach(e => {
        s.push(`${e.resStatusName}${e.countNum}台`)
      })
      return s.join('、')
    },
    chart () {
      let chartData = []
      this.status.map((e) => {
        chartData.push({
          value: e.countNum,
          name: e.resStatusName + '/' + e.resStatusName + '率'
        })
      })
      return chartData.length > 0 ? chartData : pieData
    }
  }
}
</script>
