<style lang="less">
.device-icon-container {
  position: absolute;
  width: 44px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  z-index: 5;
  .device-icon {
    height: 44px;
    border-radius: 50%;
    text-align: center;
    padding-top: 8px;
    margin-bottom: 8px;
    &.active {
      box-shadow: 0px 0px 5px 5px #888888;
    }
    .ivu-badge-count {
      border: none;
      box-shadow: none;
    }
  }
}
</style>

<template>
  <div class="device-icon-container">
    <div class="device-icon" @click.stop="sendEvents(id, $event)" :style="{background:status}">
      <Badge :count="num">
        <img width="30" :src="currentDevice.icon">
      </Badge>
    </div>
    <span class="device-name">{{currentDevice.name}}</span>
  </div>
</template>

<script>
import iconFs from '@/assets/images/device/icon_device_fs.png'
import iconBgd from '@/assets/images/device/icon_device_bgd.png'
import iconGdj from '@/assets/images/device/icon_device_gdj.png'
import iconGm from '@/assets/images/device/icon_device_gm.png'
import iconSd from '@/assets/images/device/icon_device_sd.png'
import iconSxt from '@/assets/images/device/icon_device_sxt.png'
import iconSgd from '@/assets/images/device/icon_device_sgd.png'

export default {
  props: {
    device: {
      type: Number,
      default: 1
    },
    status: {
      type: String
    },
    num: {
      type: Number,
      default: 0
    },
    id: {
      type: String
    }
  },
  computed: {
    currentDevice: function () {
      return this.icons.filter(item => item.key === this.device)[0]
    }
  },
  methods: {
    sendEvents (id, e) {
      [...document.querySelectorAll('.device-icon')].forEach(item => {
        item.classList.remove('active')
      })
      e.currentTarget.classList.add('active')
      this.$emit('show-detail', id)
    }
  },
  data () {
    return {
      icons: [{
        key: 1,
        name: '供电',
        icon: iconSd
      }, {
        key: 2,
        name: '补光灯',
        icon: iconBgd
      }, {
        key: 3,
        name: '闪光灯',
        icon: iconSgd
      }, {
        key: 4,
        name: '摄像头',
        icon: iconSxt
      }, {
        key: 5,
        name: '光端机',
        icon: iconGdj
      }, {
        key: 6,
        name: '柜门',
        icon: iconGm
      }, {
        key: 7,
        name: '风扇',
        icon: iconFs
      }]
    }
  }
}
</script>
