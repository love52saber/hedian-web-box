<style lang="less" scoped>
@import url("./equipbox.less");
</style>

<template>
  <div class="equipbox-container">
    <div class="left" @click="tempClick(deviceDetail.resId,'boxShow')">
      <h4 class="equipbox-name" v-text="deviceDetail.resAlias || deviceDetail.resName || '智能运维终端'"></h4>
      <div class="equipbox" @click="tempClick(deviceDetail.resId,'boxShow')" :style="{ borderColor:deviceDetail.resColor}">
        <Badge style="float:right;margin:10px" class="badge" :count="getResBadge()" />
        <ul class="status-list">
          <li class="status-item">功率：{{power}}</li>
          <li class="status-item">电压：{{voltage}}</li>
          <li class="status-item">电流：{{current}} </li>
        </ul>
        <div class="indoor-temp" @click.stop="tempClick(resInfo('25').resId,'25','in')">
          <Icon size="35" :color="resInfo('25').showColor|| defaultColor" type="ios-thermometer-outline"></Icon>
          <p class="text">箱内温度:{{resInfo('25').kpiKeyMap ? resInfo('25').kpiKeyMap.temperature.dataValue || 0 : 0}}{{resInfo('25').kpiKeyMap ? resInfo('25').kpiKeyMap.temperature.unitEn : '°C'}}</p>
        </div>
        <div class="outdoor-temp" @click.stop="tempClick(resInfo('26').resId,'26','out')">
          <Icon size="35" :color="resInfo('26').showColor || defaultColor" type="ios-thermometer-outline"></Icon>
          <p class="text">箱外温度:{{resInfo('26').kpiKeyMap ? resInfo('26').kpiKeyMap.temperature.dataValue || 0 : 0}}{{resInfo('26').kpiKeyMap ? resInfo('26').kpiKeyMap.temperature.unitEn : '°C'}}</p>
        </div>
        <!-- 市电 -->
        <device-icon :device="1" :status="deviceDetail.resAbnormalId === 1011? '#6d6c6c' : defaultColor" class="port1"></device-icon>
        <!-- 补光 -->
        <device-icon :device="2" :num="getResBadge('22')" :status="resInfo('22').showColor || defaultColor" class="port2" @show-detail="showDetail(resInfo('22').resId,'currentShow','22')" :id="'currentShow'"></device-icon>
        <!-- 闪光 -->
        <device-icon :device="3" :num="getResBadge('23')" :status="resInfo('23').showColor || defaultColor" class="port3" @show-detail="showDetail(resInfo('23').resId,'currentShow','23')" :id="'currentShow'"></device-icon>
        <!-- 摄像 -->
        <device-icon :device="4" :num="getResBadge('21')" :status="resInfo('21').showColor || defaultColor" class="port4" @show-detail="showDetail(resInfo('21').resId,'currentShow','21')" :id="'currentShow'"></device-icon>
        <!-- 光端 -->
        <device-icon :device="5" :num="getResBadge('24')" :status="resInfo('24').showColor || defaultColor" class="port5" @show-detail="showDetail(resInfo('24').resId,'currentShow','24')" :id="'currentShow'"></device-icon>
        <!-- 柜门 -->
        <device-icon :device="6" :status="resInfo('27').showColor || defaultColor" class="port6" :num="getResBadge('27')" @show-detail="showDetail(resInfo('27').resId,'doorShow')" :id="'doorShow'"></device-icon>
        <!-- 风扇 -->
        <device-icon :device="7" :status="resInfo('28').showColor || defaultColor" class="port7" :num="getResBadge('28')" @show-detail="showDetail(resInfo('28').resId,'fanShow')" :id="'fanShow'"></device-icon>
      </div>
      <div class="device-status">
        <span v-for="(item,idx) in statusList" :key="status+idx" class="status-item">
          <i :style="{background:item.color}" class="status-circle"></i>{{item.title}}
        </span>
      </div>
    </div>
    <div class="right">
      <temp :which="whichTemp" :num="num" v-if="tempShow"></temp>
      <fan v-if="fanShow" :status="resInfo('28').resStatus === 1 ? true : false"></fan>
      <door v-if="doorShow" :status="resInfo('27').resStatus === 1 ? true : false"></door>
      <current :name='currentName' :status="relayStatus" :num="currentNum" v-if="currentShow"></current>
      <box :name="deviceDetail.resAlias || deviceDetail.resName" :data="terminal" v-if="boxShow"></box>
    </div>
  </div>
</template>

<script>
import deviceIcon from './deviceIcon.vue'
import fan from './status/fan.vue'
import door from './status/door.vue'
import temp from './status/temp.vue' // 温度计
import current from './status/current.vue'
import box from './status/box.vue'
import { mapState } from 'vuex'
import _ from 'lodash'
export default {
  components: {
    deviceIcon,
    box,
    fan,
    door,
    temp,
    current
  },
  data () {
    return {
      statusList: [
        {
          title: '紧急',
          color: '#ff0000'
        }, {
          title: '重要',
          color: '#ff6600'
        }, {
          title: '次要',
          color: '#ffae00'
        }, {
          title: '提示',
          color: '#eed193'
        }, {
          title: '离线',
          color: '#6d6c6c'
        }, {
          title: '未知',
          color: '#1a689f'
        }, {
          title: '正常',
          color: '#04bbb7'
        }
      ],
      defaultColor: '#04bbb7',
      status: '',
      currentShow: false,
      fanShow: false,
      doorShow: false,
      boxShow: false,
      tempShow: false,
      num: 0, // 温度数
      currentNum: 0,
      relayStatus: true, // 继电器状态
      terminalParams: {},
      whichTemp: '',
      currentName: ''

    }
  },
  watch: {
    isShow: function (val) {
      if (!val) {
        this.currentShow = false
        this.fanShow = false
        this.doorShow = false
        this.boxShow = false
        this.tempShow = false
        this.terminalParams = {};
        [...document.querySelectorAll('.device-icon')].forEach(item => { // 清除设备选中状态
          item.classList.remove('active')
        })
      } else {
        this.boxShow = true
      }
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      deviceDetail: state => state.device.deviceDetail,
      power: state => {
        const power = state.device.deviceDetail.kpiKeyMap && state.device.deviceDetail.kpiKeyMap.power
        if (power) return (power.dataValue || 0) + power.unitEn
        return '0W'
      },
      voltage: state => {
        const voltage = state.device.deviceDetail.kpiKeyMap && state.device.deviceDetail.kpiKeyMap.voltage
        if (voltage) return (voltage.dataValue || 0) + voltage.unitEn
        return '0V'
      },
      current: state => {
        const current = state.device.deviceDetail.kpiKeyMap && state.device.deviceDetail.kpiKeyMap.current
        if (current) return (current.dataValue || 0) + current.unitEn
        return '0A'
      }
    }),
    resInfo (id) { // 与resInfoCallback联动查询实现各个终端设备计算属性查询
      return function (id) {
        return this.resInfoCallback(id)
      }
    },
    terminal () { // 终端参数
      if (this.$store.state.device.deviceDetail) {
        this.terminalParams = {}
        for (let i in this.$store.state.device.deviceDetail.kpiKeyMap) {
          this.terminalParams[i] = this.$store.state.device.deviceDetail.kpiKeyMap[i].dataValue
        }
      }
      return this.terminalParams
    },
    getResBadge (id) { // icon角标数量计算属性实现
      return function (id) {
        return this.getResBadgeCallback(id)
      }
    }
  },
  methods: {
    showDetail (resId, id, computedProps) {
      const arr = ['fanShow', 'doorShow', 'tempShow', 'currentShow', 'boxShow']
      const deviceInfo = {
        '22': '补光灯',
        '23': '闪光灯',
        '21': '摄像头',
        '24': '光端机'
      }
      this.currentName = computedProps ? deviceInfo[computedProps] : ''
      arr.forEach((e) => {
        this[e] = false
      })
      this.$store.commit('setCurrentRes', resId) // 更新当前设备
      if (id === 'currentShow') { // 电流和继电器组件
        this.currentNum = Number(this.resInfoCallback(computedProps).kpiKeyMap.current.dataValue || 0)
        this.relayStatus = this.resInfoCallback(computedProps).kpiKeyMap.relay.dataValue === 'on'
      }
      this.$store.dispatch('getDeviceAlarm', resId)
      this[id] = true
    },
    tempClick (resId, computedProps, which) {
      if (computedProps === 'boxShow') {
        this.showDetail(resId, 'boxShow');
        [...document.querySelectorAll('.device-icon')].forEach(item => { // 清除设备选中状态
          item.classList.remove('active')
        })
        return
      }
      this.whichTemp = which === 'in'
      this.num = Number(this.resInfoCallback(computedProps).kpiKeyMap.temperature.dataValue || 0) // 防止NaN
      this.showDetail(resId, 'tempShow')
    },
    getResBadgeCallback (id) {
      const data = this.$store.state.device.deviceDetail && this.$store.state.device.deviceDetail.terminalObjct
      if (!data) return 0
      if (!id) { // 没传id，取终端的角标数目
        const terminalErrInfos = this.$store.state.device.deviceDetail && this.$store.state.device.deviceDetail.terminalErrInfos
        return _.keys(terminalErrInfos).length
      }
      /**
       * 传了id的情况，取子设备的角标数目
       */
      const errList = _.keys(data[id].terminalErrInfos)
      return errList.length
    },
    resInfoCallback (id) {
      const data = this.$store.state.device.deviceDetail && this.$store.state.device.deviceDetail.terminalObjct
      if (!data) return {}
      return data[id]
    }
  }

}
</script>
