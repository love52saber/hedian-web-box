<template>
  <div class="g_home_container">
    <Row class="m_home_statistics">
      <i-col :span="4" style="padding-bottom: 20px;z-index:499">
        <device-tree @tree-select="handleMarkerClick" :device-tree="deviceTree" />
      </i-col>
      <i-col :push="15" :span="5" style="padding-bottom: 20px;z-index:499">
        <alarm-statistics :levels="levels" :status="statusList" class="mb20" />
        <latest-top-fault :data="latestTopFault" class="mb20" />
        <fault-statistics :device="topDevice" :fault="topFault" />
      </i-col>
    </Row>
    <device-map @marker-click="handleMarkerClick" ref="map" area="阜宁县" :center="center" />
    <device-detail :show="showDeviceDetail" @switch="switchShow" />
  </div>
</template>

<script>
import { ChartPie, ChartBar } from '_c/charts'
import deviceMap from '_c/home/map'
import deviceTree from '_c/home/device-tree'
import AlarmStatistics from '_c/home/alarm-statistics'
import LatestTopFault from '_c/home/latest-top-fault'
import FaultStatistics from '_c/home/fault-statistics'
import DeviceDetail from '_c/home/device-detail'
import { mapActions, mapState, mapMutations } from 'vuex'
import bus from '@/libs/bus'
export default {
  name: 'Home',
  components: {
    ChartPie,
    ChartBar,
    deviceMap,
    deviceTree,
    AlarmStatistics,
    LatestTopFault,
    FaultStatistics,
    DeviceDetail
  },
  data () {
    return {
      showDeviceDetail: false
    }
  },
  computed: {
    ...mapState({
      center: state => state.device.center,
      latestTopFault: state => state.abnormal.latestTopFault,
      levels: state => state.statistics.levels,
      statusList: state => state.statistics.statusList,
      topDevice: state => state.statistics.topFaultDeviceStatistics,
      topFault: state => state.statistics.topFaultStatistics,
      deviceTree: state => state.device.deviceTree,
      currentDevice: state => state.device.currentDevice,
      currentRes: state => state.device.currentRes
    })
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions([
      'getDeviceTree',
      'getLatestTopFault',
      'getDeviceLevels',
      'getDeviceStatusList',
      'getTopFaultDeviceStatistics',
      'getTopFaultStatistics',
      'getDeviceDetail',
      'getDeviceAlarm'
    ]),
    ...mapMutations([
      'setCurrentDevice',
      'setCurrentRes'
    ]),
    init () {
      this.getDeviceTree() // 获取设备树
      this.getLatestTopFault() // 最新TOP故障
      this.getDeviceLevels() // 获取告警等级统计
      this.getDeviceStatusList() // 获取报警统计中状态统计
      this.getTopFaultDeviceStatistics() // top故障设备统计
      this.getTopFaultStatistics() // top故障统计
    },
    handleMarkerClick (resId) { // 点击地图上的点查看详情
      this.showDeviceDetail = true
      this.getDeviceDetail(resId)
      this.getDeviceAlarm(resId)
      this.setCurrentDevice(resId)
      this.setCurrentRes(resId)
    },
    switchShow () {
      this.showDeviceDetail = !this.showDeviceDetail
    }
  },
  mounted () {
    bus.$on('shouldUpdatePage', () => {
      this.init()
      console.log(22222222222)
      console.log(this.showDeviceDetail)
      if (!this.showDeviceDetail) return
      console.log(111111111111111111)
      this.getDeviceDetail(this.currentDevice)
      this.getDeviceAlarm(this.currentRes)
    })
  }
}
</script>

<style lang="less">
.g_home_container {
  width: 100%;
  height: 100%;
  position: relative;
  .m_home_statistics {
    position: absolute;
    left: 0;
    top: 15px;
    padding: 0 10px;
    .ivu-card-head {
      padding: 5px 15px;
    }
  }
}
</style>
