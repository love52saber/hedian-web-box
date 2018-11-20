<style lang="less">
.g_update_user {
  width: 60%;
  margin: 0 auto;
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
  <Modal width="650" title="修改资料" v-model="show" :closable="false" :mask-closable="false">
    <Form class="g_update_user" ref="form" :model="form" :rules="rules" :label-width="100">
      <div class="m_avatar_box">
        <Upload ref="upload" accept="image/*" :headers="headers" :show-upload-list='false' :max-size='2048' :on-exceeded-size="overSize" :on-success="uploadSuccess" :action="action">
          <Avatar @mouseover.native.stop="isHover = true" @mouseout.native.stop="isHover = false" :src="avatar" size='large' :icon="isHover ? 'md-cloud-upload' :'ios-person'" style="cursor:pointer" />
        </Upload>
      </div>
      <FormItem label="姓名：">
        <span v-text="form.name"></span>
      </FormItem>
      <FormItem label="性别：">
        <RadioGroup v-model="form.sex">
          <Radio :label="1" disabled>男</Radio>
          <Radio :label="2" disabled>女</Radio>
          <Radio :label="0" disabled>未知</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem prop="mobile" label="手机号码：">
        <Input v-model="form.mobile" placeholder="请输入手机号码"></Input>
      </FormItem>
      <FormItem prop="telephone" label="固定电话">
        <Input v-model="form.telephone" placeholder="请输入固定电话"></Input>
      </FormItem>
      <FormItem prop="email" label="邮箱：">
        <Input v-model="form.email" placeholder="请输入邮箱"></Input>
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
import { getUserInfo, getToken, setUserInfo } from '@/libs/util'
import _ from 'lodash'
import config from '@/config'
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
      show: state => state.user.showUpdateUserInfoModal
    }),
    avatar () {
      return !this.hasUploadAvatar ? this.userAvator : config.fileHost + this.form.url
    }
  },
  data () {
    return {
      isHover: false,
      hasUploadAvatar: false,
      form: {
        name: '',
        url: '',
        mobile: '',
        telephone: '',
        email: '',
        userId: '',
        sex: ''
      },
      headers: {
        Authorization: getToken()
      },
      action: process.env.NODE_ENV === 'development' ? `${config.baseUrl.dev}/api/resource` : `${config.baseUrl.pro}/api/resource`,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^[1][34578]\d{9}$/, message: '手机号码不正确', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入固话号码', trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '固话号码不正确', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '邮箱地址不正确', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.$watch('show', (val) => {
      if (!val) return
      this.initUserInfo()
    })
  },
  methods: {
    ...mapMutations([
      'setShowUpdateUserInfoModal',
      'setAvator'
    ]),
    ...mapActions([
      'updateUserInfo'
    ]),
    overSize () {
      this.$Notice.warning({ title: '上传的头像文件大小需要低于2M' })
    },
    initUserInfo () {
      let user = getUserInfo()
      if (!user) return
      user = JSON.parse(user)
      _.forIn(this.form, (value, key) => {
        this.form[key] = user[key]
      })
    },
    uploadSuccess (res) {
      // console.log('===头像上传===', res)
      if (res.msg === 'success') {
        this.hasUploadAvatar = true
        this.form.url = res.data
      }
    },
    ok () { // 提交资料修改
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.updateUserInfo({ ...this.form, url: this.form.url ? this.form.url : '' }).then(res => {
          // console.log('===修改用户资料===', res)
          if (res.msg !== 'success') return
          this.$Notice.success({ title: '资料更新成功' })
          if (this.form.url) this.setAvator(this.form.url) // 更新头像
          const user = JSON.parse(getUserInfo())
          const willUpdateUserInfo = {
            ...user,
            ...this.form
          }
          willUpdateUserInfo.sysFile.url = this.form.url ? this.form.url : willUpdateUserInfo.sysFile.url
          setUserInfo(willUpdateUserInfo)
          this.cancel()
        })
      })
    },
    cancel () {
      this.hasUploadAvatar = false
      this.$refs.form.resetFields()
      this.setShowUpdateUserInfoModal(!this.show)
    }
  }
}
</script>
