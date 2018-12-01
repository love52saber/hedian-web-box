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
  .mb20 {
    margin-bottom: 20px;
  }
  .mb30 {
    margin-bottom: 30px;
  }
  .mb40 {
    margin-bottom: 40px;
  }
  .mt20 {
    margin-top: 20px;
  }
  .mb10 {
    margin-bottom: 10px !important;
  }
  .mt10 {
    margin-top: 10px !important;
  }
  .mr10 {
    margin-right: 10px;
  }
  .mr20 {
    margin-right: 20px;
  }
  .mr30 {
    margin-right: 30px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .w50 {
    width: 50% !important;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .ivu-table-body td {
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
