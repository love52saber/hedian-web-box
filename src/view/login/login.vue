<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <h1 class="app-title" v-text="appName">智能运维管理系统</h1>
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form ref="loginForm" @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">点击按钮或按下回车键即可</p>
        </div>
        <div class="copyright">
          <p class="lg-copyright">版权所有：南京和电科技有限公司 2018~present <br />技术支持：南京和电科技有限公司</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    LoginForm
  },
  created () {
    this.getAppName()
    this.forgotPassword()
  },
  computed: {
    ...mapState({
      appName: state => state.app.appName
    })
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getAppName',
      'forgotPassword'
    ]),
    handleSubmit ({ username, password }) {
      this.handleLogin({ username, password }).then(res => {
        if (res.msg !== 'success') return this.$Notice.error({ title: res.msg })
        if (this.$refs.loginForm.remember) { // 如果勾选记住用户名，则把用户名存在本地
          localStorage.setItem('username', username)
        }
        this.$router.push({
          name: this.$config.homeName
        })
        this.$Notice.success({ title: '欢迎登录' })
        if (res.data.user.pwdFlag === 2) this.$Notice.warning({ title: '您的密码需要修改', desc: '初始密码需要修改' })
      })
    }
  }
}
</script>

<style>
</style>
