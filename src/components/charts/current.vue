<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'Current',
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          max: window.config.VUE_APP_DEFAULT_CURRENT_MAX,
          value: 0
        }
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
        series: [
          {
            name: '电流',
            type: 'gauge',
            max: this.value.max,
            detail: { formatter: '{value}A', fontSize: 16 },
            data: [{ value: this.value.value, name: '电流' }],
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
