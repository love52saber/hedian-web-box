<style lang="less" >
.m_footer {
  text-align: center;
  .u_btn {
    width: 100px;
    &.u_btn_ok {
      background: #04bbb7;
    }
  }
}
</style>
<template>
  <Modal :z-index="1002" v-model="show" width="360" :closable="false" :mask-closable="false">
    <h3 slot="header">操作确认</h3>
    <div style="text-align:center">
      <img src="../../assets/images/controls/warning.png" alt="warning">
      <div>
        是否确认
        <span v-text="action"></span>
        <span style="color:#04bbb7" v-text="operator"></span>
      </div>
    </div>
    <div class="m_footer" slot="footer">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="ok">确定</Button>
      <Button class="u_btn" type="default" @click="cancel" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Confirm',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    },
    operator: {
      type: String,
      default: ''
    },
    onOk: {
      type: Function
    },
    confirmId: {
      default: ''
    }
  },
  methods: {
    ...mapMutations(['setShowConfirmModal']),
    ok () {
      // 第二个参数是用来删除提示的，因为批量删除只需要提示一此
      // 第三个参数在用户管理里面用到，锁定和解锁用户，其余功能都没有接收第三个参数
      this.onOk(this.confirmId, true, this.action === '锁定' ? 'lock' : 'unlock')
    },
    cancel () {
      this.setShowConfirmModal(false)
    }
  }
}
</script>
