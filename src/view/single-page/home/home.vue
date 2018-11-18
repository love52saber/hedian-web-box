<template>
  <div class="g_home_container">
    <Row class="m_home_statistics">
      <i-col :span="5" style="padding-bottom: 20px;z-index:499">
        <device-tree />
      </i-col>
      <i-col :push="14" :span="5" style="padding-bottom: 20px;z-index:499">
        <alarm-statistics :levels="levels" :status="statusList" class="mb20" />
        <latest-top-fault :data="latestTopFault" class="mb20" />
        <!-- <Card title="最新TOP故障统计" shadow>
          <chart-bar style="height: 180px;" :value="barData" />
        </Card> -->

      </i-col>
    </Row>
    <device-map ref="map" area="阜宁县" :center="center" />
  </div>
</template>

<script>
import { ChartPie, ChartBar } from '_c/charts'
import deviceMap from '_c/home/map'
import deviceTree from '_c/home/deviceTree'
import AlarmStatistics from '_c/home/alarmStatistics'
import LatestTopFault from '_c/home/latestTopFault'
import FaultStatistics from '_c/home/faultStatistics'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Home',
  components: {
    ChartPie,
    ChartBar,
    deviceMap,
    deviceTree,
    AlarmStatistics,
    LatestTopFault,
    FaultStatistics
  },
  data () {
    return {
      center: [33.68573, 119.795338],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  computed: {
    ...mapState({
      latestTopFault: state => state.abnormal.latestTopFault,
      levels: state => state.statistics.levels,
      statusList: state => state.statistics.statusList
    })
  },
  created () {
    this.getDeviceTree() // 获取设备树
    this.getLatestTopFault() // 最新TOP故障
    this.getDeviceLevels() // 获取告警等级统计
    this.getDeviceStatusList()
  },
  methods: {
    ...mapActions([
      'getDeviceTree',
      'getLatestTopFault',
      'getDeviceLevels',
      'getDeviceStatusList'
    ])
  },
  mounted () {
    //
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
