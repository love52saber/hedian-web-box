<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Object,
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
      let xAxisData = Object.keys(this.value)
      let seriesData = Object.values(this.value)
      let option = {
        color: ['#63afd2'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#63afd2'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#63afd2'
            }
          },
          axisLabel: {
            color: '#fff',
            show: true,
            interval: 0,
            rotate: 15
          }
        }],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#fff'
              }
            },
            axisLabel: {
              color: '#fff'
            }
          }
        ],
        series: [{
          data: seriesData,
          name: '数量',
          type: 'bar',
          barWidth: '35%',
          label: {
            normal: {
              position: 'top',
              show: true
            }
          }
        }]
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
