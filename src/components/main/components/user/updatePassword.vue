<style lang="less">
.g_update_password {
  width: 60%;
  margin: 0 auto;
  padding: 30px 0;
  .m_avatar_box {
    margin: 20px 0;
    text-align: center;
  }
}
.ivu-modal-footer {
  padding: 0;
  text-align: center;
}
</style>

<template>
  <Modal width="650" title="修改密码" v-model="show" :closable="false" :mask-closable="false">
    <Form class="g_update_password" ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="oldPassword" label="旧密码：">
        <Input v-model="form.oldPassword" type="password" placeholder="请输入旧密码"></Input>
      </FormItem>
      <FormItem prop="password" label="新密码：">
        <Input v-model="form.password" type="password" placeholder="请输入新密码"></Input>
      </FormItem>
      <FormItem prop="rePassword" label="确认密码：">
        <Input v-model="form.rePassword" type="password" placeholder="请再输入一次新密码"></Input>
      </FormItem>
    </Form>
    <div slot="footer" style="text-align:center">
      <Button type="primary" @click="ok">确定</Button>
      <Button @click="cancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'UpdateUserInfo',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      show: state => state.user.showUpdatePasswordModal,
      userId: state => state.user.userId
    })
  },
  data () {
    const isSame = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      form: {
        oldPassword: '',
        password: '',
        rePassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, message: '密码不少于6位', trigger: 'blur' },
          { max: 18, message: '密码不多于18位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码不少于6位', trigger: 'blur' },
          { max: 18, message: '密码不多于18位', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请重新输入新密码', trigger: 'blur' },
          { min: 6, message: '密码不少于6位', trigger: 'blur' },
          { max: 18, message: '密码不多于18位', trigger: 'blur' },
          { validator: isSame, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations([
      'setShowUpdatePasswordModal'
    ]),
    ...mapActions([
      'updatePassword'
    ]),
    ok () { // 提交密码修改
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.updatePassword({ ...this.form, userId: this.userId }).then(res => {
          // console.log('===修改用户资料===', res)
          if (res.msg !== 'success') return
          this.$Notice.success({ title: '修改成功，请牢记您的新密码' })
          this.cancel()
        })
      })
    },
    cancel () {
      this.$refs.form.resetFields()
      this.setShowUpdatePasswordModal(!this.show)
    }
  }
}
</script>
