<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'DeviceChart',
  props: {
    value: {
      type: Array,
      default: () => {
        return [
          {
            value: 0,
            max: window.config.VUE_APP_DEFAULT_POWER_MAX
          },
          {
            value: 0,
            max: window.config.VUE_APP_DEFAULT_VOLTAGE_MAX
          },
          {
            value: 0,
            max: window.config.VUE_APP_DEFAULT_CURRENT_MAX
          }
        ]
      }
    },
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    render () {
      let option = {
        tooltip: {
          trigger: 'item'
        },
        color: ['#04bbb7', '#ff0000', '#1a689f', '#6d6c6c'],
        series: [
          {
            name: '功率',
            type: 'gauge',
            center: ['50%', '35%'],
            radius: '50%',
            max: this.value[0].max,
            detail: { formatter: '{value}W', fontSize: 16 },
            data: [{ value: this.value[0].value, name: '功率' }],
            axisLine: {
              lineStyle: {
                width: 15,
                color: [[1, '#04bbb7']]
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              distance: -50,
              color: '#1e7f7d'
            },
            pointer: {
              width: 2
            },
            title: {
              offsetCenter: [0, '80%'],
              color: '#1e7f7d',
              fontWeight: 'bold'
            }
          },
          {
            name: '电压',
            type: 'gauge',
            center: ['20%', '70%'],
            radius: '50%',
            min: 0,
            max: this.value[1].max,
            startAngle: 225,
            endAngle: -45,
            splitNumber: 10,
            detail: { formatter: '{value}V', fontSize: 16 },
            data: [{ value: this.value[1].value, name: '电压' }],
            axisLine: {
              lineStyle: {
                width: 15,
                color: [[1, '#04bbb7']]
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              distance: -55,
              color: '#1e7f7d'
            },
            pointer: {
              width: 2
            },
            title: {
              offsetCenter: [0, '80%'],
              color: '#1e7f7d',
              fontWeight: 'bold'
            }
          },
          {
            name: '电流',
            type: 'gauge',
            center: ['80%', '70%'],
            radius: '50%',
            min: 0,
            max: this.value[2].max,
            startAngle: 225,
            endAngle: -45,
            detail: { formatter: '{value}A', fontSize: 16 },
            data: [{ value: this.value[2].value, name: '电流' }],
            axisLine: {
              lineStyle: {
                width: 15,
                color: [[1, '#04bbb7']]
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              distance: -50,
              color: '#1e7f7d'
            },
            pointer: {
              width: 2
            },
            title: {
              offsetCenter: [0, '80%'],
              color: '#1e7f7d',
              fontWeight: 'bold'
            }
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.render()
      on(window, 'resize', this.resize)
    })
    this.$watch('value', () => {
      this.render()
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
