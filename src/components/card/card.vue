<template>
  <Card class="g_card_container" :shadow="shadow" :title="cardTitle" :bordered="false">
    <div v-if="showSlotHeader" slot="title">
      <slot name="title"></slot>
    </div>
    <div slot="extra">
      <slot name="extra"></slot>
    </div>
    <i class="left-top-border"></i>
    <i class="left-bottom-border"></i>
    <i class="right-top-border"></i>
    <i class="right-bottom-border"></i>
    <slot></slot>
  </Card>
</template>
<script>
import './card.less'
export default {
  name: 'InfoCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    shadow: {
      type: Boolean,
      default: false
    },
    hasHeader: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    cardTitle () {
      return this.hasHeader ? this.title : ''
    },
    showSlotHeader () {
      return this.title === '' && this.hasHeader
    }
  }
}
</script>
