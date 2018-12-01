<style lang="less" scoped>
.door-container {
  .device-name {
    color: #ffffff;
    font-size: 16px;
    text-align: center;
    margin: -45px 0 45px 0;
    line-height: 40px;
    padding-left: 40px;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .text {
    margin-top: 10px;
    color: #fff;
    font-size: 15px;
    text-align: center;
  }
}
</style>

<template>
  <div class="door-container">
    <div class="device-name" :style="{background: 'url('+ icon_gm +') no-repeat' }">
      柜门
    </div>
    <img :src="status ? door_normal : door_bad" alt="柜门状态">
    <p class="text">{{ status ? '关' : '开' }}</p>
  </div>
</template>

<script>
// eslint-disable-next-line
import door_normal from '@/assets/images/device/status_gm_normal.png'
// eslint-disable-next-line
import door_bad from '@/assets/images/device/status_gm_bad.png'
// eslint-disable-next-line
import icon_gm from '@/assets/images/device/icon_device_gm.png'

export default {
  data () {
    return {
      door_normal,
      door_bad,
      icon_gm
    }
  },
  props: {
    status: {
      type: Boolean,
      default: true
    }
  }
}
</script>
