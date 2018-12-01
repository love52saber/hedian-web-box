<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'Temperature',
  props: {
    value: {
      type: Number,
      default: 0
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
          formatter: '{b} : {c}℃'
        },
        series: [
          {
            name: '温度计',
            type: 'gauge',
            detail: { formatter: '{value}℃', fontSize: 16 },
            data: [{ value: this.value, name: '温度计' }],
            axisLine: {
              lineStyle: {
                width: 15,
                color: [[0.3, '#1a75d3'], [0.7, '#58f837'], [1, '#f6a212']]
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
