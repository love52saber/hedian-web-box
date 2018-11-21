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
    }
  },
  methods: {
    ...mapMutations(['setShowConfirmModal']),
    ok () {
      this.onOk()
    },
    cancel () {
      this.setShowConfirmModal(false)
    }
  }
}
</script>
