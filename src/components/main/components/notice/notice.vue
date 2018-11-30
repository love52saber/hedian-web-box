<template>
  <ul class="m_notice">
    <li class="u_notice_item">
      <Badge :count="todoNumber">
        <Avatar style="background:#4ea1cc" icon="md-alarm" />
      </Badge>
      <span>待办</span>
    </li>
    <li class="u_notice_item" @click="toPage">
      <Badge :count="warningNumber">
        <Avatar style="background:#f7b045;" icon="md-alert" />
      </Badge>
      <span>警告</span>
    </li>
    <li class="u_notice_item">
      <Badge :count="msgNumber">
        <Avatar style="background:#1b50ca;" icon="md-mail" />
      </Badge>
      <span>消息</span>
    </li>
  </ul>
</template>
<script>
import './notice.less'
export default {
  name: 'Notice',
  props: {
    todoNumber: {
      type: Number,
      default: 0
    },
    warningNumber: {
      type: Number,
      default: 0
    },
    msgNumber: {
      type: Number,
      default: 0
    }
  },
  methods: {
    toPage () {
      this.$router.push({
        name: 'realTimeAbnormal'
      })
    }
  }
}
</script>
