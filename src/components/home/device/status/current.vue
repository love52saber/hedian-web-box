<style lang="less" scoped>
.current-container {
  display: flex;
  width: 600px;
  height: 200px;
}
.device-name {
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  width: 100px;
  margin: -20px auto 20px;
  line-height: 40px;
  padding-left: 40px;
}
.left,
.right {
  flex: 1;
  height: 100%;
}
.right {
  padding-top: 120px;
  text-align: center;
  img {
    width: 120px;
    height: 30px;
  }
  .title {
    text-align: center;
    color: #1e7f7d;
    font-size: 15px;
  }
}
</style>

<template>
  <div class="container">
    <div class="device-name" :style="{background: 'url('+ nameMap[name] +') no-repeat' }">{{this.name}}</div>
    <div class="current-container">
      <div class="left">
        <current :value="value" style="height:200px" />
      </div>
      <div class="right">
        <img :src="status ? jdq_normal : jdq_bad" alt="继电器" />
        <p class="title">继电器</p>
      </div>
    </div>
  </div>

</template>

<script>
import { Current } from '_c/charts'
// eslint-disable-next-line
import jdq_normal from '@/assets/images/device/status_jdq_normal.png'
// eslint-disable-next-line
import jdq_bad from '@/assets/images/device/status_jdq_bad.png'
// eslint-disable-next-line
import icon_bgd from '@/assets/images/device/icon_device_bgd.png'
// eslint-disable-next-line
import icon_sgd from '@/assets/images/device/icon_device_sgd.png'
// eslint-disable-next-line
import icon_sxt from '@/assets/images/device/icon_device_sxt.png'
// eslint-disable-next-line
import icon_gdj from '@/assets/images/device/icon_device_gdj.png'

export default {
  data () {
    return {
      jdq_normal,
      jdq_bad,
      config,
      icon_bgd,
      icon_sgd,
      icon_sxt,
      icon_gdj
    }
  },
  props: {
    num: {
      type: Number,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
    }
  },
  computed: {
    value () {
      return {
        value: this.num,
        max: window.config.VUE_APP_DEFAULT_CURRENT_MAX
      }
    },
    nameMap () {
      return {
        '摄像头': this.icon_sxt,
        '补光灯': this.icon_bgd,
        '闪光灯': this.icon_sgd,
        '光端机': this.icon_gdj
      }
    }
  },
  components: {
    Current
  }
}
</script>
