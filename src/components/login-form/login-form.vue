<style>
.mb10 {
  margin-bottom: 10px;
}
.login_form_forget {
  float: right;
  cursor: pointer;
  color: #999;
}
</style>

<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input v-model="form.username" element-id="username" placeholder="请输入用户名">
      <span slot="prepend">
        <Icon :size="16" type="ios-person"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" ref="pwd" v-model="form.password" placeholder="请输入密码">
      <span slot="prepend">
        <Icon :size="14" type="md-lock"></Icon>
      </span>
      </Input>
    </FormItem>

    <FormItem>
      <Checkbox v-model="remember">记住用户名</Checkbox>
      <span @click.stop="showForgot = true" class="login_form_forget">忘记密码？</span>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
    <forgot-password :show="showForgot" @close='showForgot=false' />
  </Form>
</template>
<script>
import ForgotPassword from './forgot'
export default {
  name: 'LoginForm',
  components: {
    ForgotPassword
  },
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      remember: false,
      showForgot: false
    }
  },
  mounted () {
    this.remember = !!localStorage.getItem('username')
    if (this.remember) {
      this.form.username = localStorage.getItem('username')
    }
    this.$watch('remember', (val) => {
      if (!val) window.localStorage.removeItem('username')
    })
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      if (document.activeElement && document.activeElement.id === 'username' && this.form.password === '') {
        this.$refs.pwd.focus()
      } else {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$emit('on-success-valid', {
              username: this.form.username,
              password: this.form.password
            })
          }
        })
      }
    }
  }
}
</script>
