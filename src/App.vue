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
      background-color: #04bbb7;
      border-color: #04bbb7;
      a {
        color: #fff;
      }
    }
  }
}
#app {
  .size;
}
</style>
