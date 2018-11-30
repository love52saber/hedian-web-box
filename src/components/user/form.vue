<style lang="less">
</style>
<template>
  <Modal v-model="formData.show" :title="formData.action" :width="650" class='g_user_add' :scrollable='true' :closable="false" :mask-closable="false">
    <Form style="width:60%;margin:0 auto" :model="form" :rules='rules' ref="form" :label-width="100">
      <div class="mb20" style="text-align:center">
        <Upload ref="upload" accept="image/*" :headers="headers" :show-upload-list='false' :max-size='2048' :on-exceeded-size="overSize" :on-success="uploadSuccess" :action="action">
          <Avatar @mouseover.native.stop="isHover = true" @mouseout.native.stop="isHover = false" :src="avatar" size='large' :icon="isHover ? 'md-cloud-upload' :'md-person'" style="cursor:pointer" />
        </Upload>
      </div>
      <FormItem prop='name' label="姓名：">
        <Input v-model="form.name" placeholder="输入姓名，不超过10个字" :maxlength="10"></Input>
      </FormItem>
      <FormItem prop='username' label="用户名：">
        <Input v-model="form.username" placeholder="输入用户名" :maxlength="10"></Input>
      </FormItem>
      <FormItem prop='deptName' label="部门：">
        <Input readonly @on-click="deptShow=!deptShow" @on-focus='deptShow=true' @on-blur='blur' v-model="form.deptName" placeholder="选择部门" :maxlength=20 :icon="!deptShow ? 'ios-arrow-down': 'ios-arrow-up'"></Input>
        <div v-if="deptShow" style="border:1px #ccc solid;position:absolute;z-index:999;width:100%;background:#fff;overflow:auto">
          <Tree :data="departmentTree"></Tree>
        </div>
      </FormItem>
      <FormItem prop='mobile' label="手机号：">
        <Input v-model="form.mobile" placeholder="输入手机号" />
      </FormItem>
      <FormItem prop='sex' label="性别：">
        <RadioGroup v-model="form.sex">
          <Radio :label="1">男</Radio>
          <Radio :label="2">女</Radio>
          <Radio :label="0">未知</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="固定电话：">
        <Input v-model="form.telephone" placeholder="输入固定电话" :maxlength="20" />
      </FormItem>
      <FormItem prop='email' label="邮箱：">
        <Input v-model="form.email" placeholder="输入邮箱" :maxlength="20" />
      </FormItem>
      <FormItem label="角色：">
        <CheckboxGroup v-model="form.roleIds">
          <Tooltip placement="top" :content="item.roleName" v-for="(item, index) in roleList" :key="index">
            <Checkbox :label="item.roleId">{{item.roleName}}</Checkbox>
          </Tooltip>
        </CheckboxGroup>
      </FormItem>
      <FormItem prop='status' label="状态：">
        <RadioGroup v-model="form.status">
          <Radio :label="1">正常</Radio>
          <Radio :label="0">禁用</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer">
      <Button @click="ok" class="u_btn u_btn_add" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { mapState } from 'vuex'
import { getToken } from '@/libs/util'
import _ from 'lodash'
export default {
  name: 'UserForm',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isHover: false,
      hasUploadAvatar: false,
      headers: {
        Authorization: getToken()
      },
      action: process.env.NODE_ENV === 'development' ? `${this.$config.baseUrl.dev}/api/resource` : `${this.$config.baseUrl.pro}/api/resource`,
      form: {
        name: '',
        username: '',
        sex: 1,
        mobile: '',
        telephone: '',
        email: '',
        status: 1,
        roleIds: [],
        url: '',
        deptName: ''
      },
      deptShow: false,
      deptId: '',
      rules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, type: 'number', message: '性别不能为空', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        status: [
          { required: true, type: 'number', message: '状态不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      unitList: state => state.user.organizationalUnit,
      roleList: state => state.user.allRoleList
    }),
    departmentTree () {
      let menuTree = []
      if (this.unitList && this.unitList.length) {
        this.unitList.forEach((item) => {
          menuTree.push(this.makeTree(item))
        })
      }
      return menuTree
    },
    avatar () {
      return (this.hasUploadAvatar || this.form.url) ? this.$config.fileHost + this.form.url : ''
    }
  },
  mounted () {
    this.$watch('formData', () => {
      if (this.formData.type === 1) return
      _.forIn(this.form, (val, key) => {
        this.form[key] = this.formData.info[key]
      })
      this.form.deptName = _.get(this.formData.info, 'sysDept.name', '')
      this.deptId = _.get(this.formData.info, 'sysDept.deptId', '')
      this.form.url = _.get(this.formData.info, 'sysFile.url', '')
    }, { deep: true })
  },
  methods: {
    overSize () {
      this.$Notice.warning({ title: '上传的头像文件大小需要低于2M' })
    },
    uploadSuccess (res) {
      console.log('===头像上传===', res)
      if (res.msg === 'success') {
        this.hasUploadAvatar = true
        this.form.url = res.data
      }
    },
    blur () {
      setTimeout(() => {
        this.deptShow = false
      }, 300)
    },
    ok () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.formData.callback({
          ...this.form,
          deptId: this.deptId,
          userId: this.formData.type === 2 ? this.formData.info.userId : ''
        })
      })
    },
    makeTree (node) {
      let n = {
        id: node.deptId,
        title: node.name,
        expand: true,
        render: this.render,
        children: []
      }
      if (node.children) {
        node.children.forEach(e => {
          n.children.push(this.makeTree(e))
        })
      }
      return n
    },
    render (h, { root, node, data }) {
      return h(
        'span',
        {
          class: 'ivu-tree-title',
          on: {
            click: () => {
              this.deptShow = false
              this.deptId = data.id
              this.form.deptName = data.title
            }
          }
        },
        [
          h('span', [
            h('Icon', {
              props: {
                type: 'folder',
                size: 18
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ])
        ]
      )
    },
    clear () {
      setTimeout(() => { // 恢复初始值，防止下次使用时出现问题
        this.form = {
          name: '',
          username: '',
          sex: 1,
          mobile: '',
          telephone: '',
          email: '',
          status: 1,
          roleIds: [],
          url: '',
          deptName: ''
        }
        this.deptShow = false
        this.deptId = ''
        this.hasUploadAvatar = false
        this.$refs.form.resetFields()
      }, 300)
    },
    cancel () {
      this.formData.show = false
      this.clear()
    }
  }

}
</script>
