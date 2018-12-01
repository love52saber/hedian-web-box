<style lang="less" scoped>
.fs-container {
  // height: 140px;
  // width: 140px;
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
  <div class="fs-container">
    <div class="device-name" :style="{background: 'url('+ icon_fs +') no-repeat' }">风扇</div>
    <img :src="status ? fan_normal : fan_bad" alt="风扇状态">
    <p class="text">{{ status ? '开' : '关' }}</p>
  </div>
</template>

<script>
// eslint-disable-next-line
import fan_normal from '@/assets/images/device/status_fs_normal.png'
// eslint-disable-next-line
import fan_bad from '@/assets/images/device/status_fs_bad.png'
// eslint-disable-next-line
import icon_fs from '@/assets/images/device/icon_device_fs.png'

export default {
  data () {
    return {
      fan_normal,
      fan_bad,
      icon_fs
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
