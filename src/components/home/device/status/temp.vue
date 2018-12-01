<style lang="less" scoped>
.temp-container {
  width: 200px;
  height: 200px;
  .device-name {
    color: #ffffff;
    font-size: 16px;
    text-align: center;
    margin: -30px 0 30px 0;
  }
}
</style>

<template>
  <div class="temp-container">
    <div class="device-name">
      <Icon size="30" type="ios-thermometer-outline" style="margin-right:15px"></Icon> {{which?'箱内温度':'箱外温度'}}
    </div>
    <temperature :value="num" style="height:250px" />
  </div>
</template>

<script>
import { Temperature } from '_c/charts'
export default {
  data () {
    return {
      config
    }
  },
  props: {
    num: {
      type: Number,
      required: true
    },
    which: {
      type: Boolean
    }
  },
  components: {
    Temperature
  }
}
</script>
