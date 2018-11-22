<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
  td {
    height: 42px !important;
  }
  .u_page {
    text-align: center;
    margin: 10px auto 0;
    .ivu-page-item-active {
      background-color: #2db7f5;
      border-color: #2db7f5;
      a {
        color: #fff;
      }
    }
  }
  .u_btn {
    width: 100px;
    &.u_btn_ok {
      background: #04bbb7 !important;
    }
  }
  .m_footer {
    text-align: center;
  }
}
#app {
  .size;
}
</style>
