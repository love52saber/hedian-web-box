<template>
  <div class="g_info_card_container">
    <info-card style="width:1200px">
      <template slot="title">
        <slot name="title">
          <span style="position:relative;top:-5px">
            <Icon type="ios-information-circle-outline" />
            设备详情展示
          </span>
        </slot>
      </template>
      <template slot="extra">
        <slot name="extra"></slot>
      </template>
      <slot></slot>
    </info-card>
  </div>
</template>

<script>
import InfoCard from '_c/card'
export default {
  name: 'CardModal',
  components: {
    InfoCard
  }
}
</script>

<style>
.g_info_card_container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>
