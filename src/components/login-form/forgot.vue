<template>
  <Modal :mask-closable="false" :closable="false" v-model="show" width="450">
    <p slot="header" style="color:#f60;text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>忘记密码</span>
    </p>
    <div style="text-align:center">
      <h2 v-html="forgotPassword"></h2>
    </div>
    <div slot="footer">
      <Button type="error" size="large" long @click="$emit('close')">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ForgotPassword',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      forgotPassword: state => state.user.forgotPassword
    })
  }
}
</script>
