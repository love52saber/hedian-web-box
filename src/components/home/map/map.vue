<style lang="less">
.leaflet-control-attribution.leaflet-control {
  display: none;
}
</style>

<template>
  <l-map ref="map" :zoom="11" :center="center" :options="{zoomControl:false}">
    <l-tile-layer :url="geoqTileLayer.darkblue" :options="geoqOpt"></l-tile-layer>
    <l-tile-layer :url="tiandiTileLayer.img" :options="tiandiOpt"></l-tile-layer>
    <l-polyline v-for="(item,idx) in bounds" :key="idx" :latLngs="item"></l-polyline>
    <div class="marker" v-for="(item,idx) in deviceList" :key="'marker'+idx">
      <l-circle-marker v-if="item.resStatus === 1 && !item.selected" :latLng="[item.latitude,item.longitude]" :fillColor="item.resColor" :fillOpacity="0.8" :stroke="false" :radius="item.radius" @click="deviceDotClick(item)">
        <l-tooltip>
          <h4>{{item.resAbnormaldesc ? item.resAbnormaldesc : '正常运转'}}</h4>
        </l-tooltip>
      </l-circle-marker>
      <l-marker v-else :latLng="[item.latitude,item.longitude]" :visible="true" :ref="item.resId" :icon="gifIcon(item)" @click="deviceDotClick(item)">
        <l-tooltip>
          <h4>{{item.resAbnormaldesc ? item.resAbnormaldesc : '正常运转'}}</h4>
        </l-tooltip>
        <l-popup v-if="item.resStatus !== 1" :latLng="[item.latitude,item.longitude]" :content="item.resAbnormaldesc ? item.resAbnormaldesc : '正常运转'"></l-popup>
      </l-marker>
    </div>

  </l-map>
</template>

<script>
import * as maps from 'vue2-leaflet'
import L from 'leaflet'
import _ from 'lodash'
import { mapMutations } from 'vuex'
import { on } from '@/libs/tools'
import { tiandiTileLayer, geoqTileLayer } from '@/map'
import { getDistrictBounds } from '@/map/amap-server'
import bus from '@/libs/bus'
import urgent from '@/assets/images/home/urgent.gif'
import important from '@/assets/images/home/important.gif'
import secondary from '@/assets/images/home/secondary.gif'
import normal from '@/assets/images/home/normal.gif'
import offline from '@/assets/images/home/offline.gif'
import tips from '@/assets/images/home/tips.gif'
import unknown from '@/assets/images/home/unknown.gif'

export default {
  name: 'Map',
  props: {
    markers: {
      type: Array,
      default: () => []
    },
    center: {
      type: Array
    },
    area: {
      type: String
    }
  },
  data () {
    return {
      tiandiTileLayer,
      geoqTileLayer,
      tempRefValue: '',
      tiandiOpt: {
        subdomains: tiandiTileLayer.subdomains,
        minZoom: 16,
        maxZoom: 16
      },
      geoqOpt: {
        minZoom: 0,
        maxZoom: 15
      },
      bounds: [],
      colorGifMap: {
        '#ff0000': urgent, // 紧急图片
        '#ff6600': important, // 重要图片
        '#ffae00': secondary, // 次要图片
        '#eed193': tips, // 提示图片
        '#6d6c6c': offline, // 离线图片
        '#1a689f': unknown, // 未知图片
        '#04bbb7': normal, // 正常图片
        'nokey': normal // 容错字段,使用正常图片
      },
      filterParams: {
        name: '',
        status: '',
        level: ''
      }
    }
  },
  computed: {
    deviceList () {
      return this.$store.state.device.deviceList.filter(item => (_.get(item, 'resAlias', '').indexOf(this.filterParams.name) > -1 || _.get(item, 'resName', '').indexOf(this.filterParams.name) > -1) && _.get(item, 'resStatusDO.resStatusName', '').indexOf(this.filterParams.status) > -1 && _.get(item, 'resAbnormallevel.resAbnormallevelName', '').indexOf(this.filterParams.level) > -1)
    }
  },
  created () {

  },
  mounted () {
    // 设备树进行了筛选过滤
    bus.$on('filter', (data) => {
      this.filterParams = data
    })
    // 设备树进行了点击
    bus.$on('device-tree-click', (id) => {
      this.openPopup(id)
    })
    this.resize()
    // 页面尺寸更改时重新适配地图避免地图瓦片未加载
    this.$nextTick(() => {
      on(window, 'resize', (e) => {
        this.$refs.map.mapObject.invalidateSize(true)
        this.resize()
      })
    })
    // 获取阜宁县边框
    getDistrictBounds(this.area, 1).then(data => {
      let { polyline } = data.districts[0]
      polyline.split('|').forEach(el => {
        let arr = []
        el.split(';').forEach(e => {
          let ll = e.split(',')
          arr.push([ll[1], ll[0]])
        })
        this.bounds.push(arr)
      })
    })
  },
  methods: {
    ...mapMutations([
      'setCenter'
    ]),
    resize () {
      const offsetHeight = document.querySelector('.m_home_statistics').offsetHeight
      const bodyHeight = document.body.offsetHeight
      const headerAndNavHeight = 104
      const elem = document.querySelector('div.g_home_container')
      elem.style.height = offsetHeight > (bodyHeight - headerAndNavHeight) ? `${offsetHeight}px` : `${bodyHeight - headerAndNavHeight}px`
    },
    gifIcon (data) { // 返回gif图标
      return L.icon({
        iconUrl: _.has(this.colorGifMap, data.resColor) ? this.colorGifMap[data.resColor] : this.colorGifMap['nokey'],
        iconSize: data.iconSize,
        iconAnchor: data.iconAnchor
      })
    },
    openPopup (e) { // 打开popup
      if (this.tempRefValue && this.$refs[this.tempRefValue] && this.$refs[this.tempRefValue].length) {
        const pop = this.$refs[this.tempRefValue][0].mapObject
        this.$nextTick(() => {
          pop.closePopup()
        })
      }
      if (!_.get(this.$refs, e, '').length) return
      const pop = this.$refs[e][0].mapObject
      this.$nextTick(() => {
        pop.openPopup()
        this.tempRefValue = e
      })
    },
    deviceDotClick (data) { // 地图上设备点击事件
      this.$emit('marker-click', data.resId);
      [...document.querySelectorAll('.u_device_item')].forEach(item => {
        item.classList.remove('active')
      })
      document.querySelector(`.u_res_id_${data.resId}`).classList.add('active')
      this.setCenter(data.resId)
      this.openPopup(data.resId)
    }
  },
  components: {
    ...maps
  }
}
</script>
