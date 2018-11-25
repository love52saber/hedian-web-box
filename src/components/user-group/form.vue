<style lang="less">
.g_user_group_form {
  .m_dept_box,
  .m_user_list,
  .m_target_list {
    border: 1px #cecece solid;
    padding: 5px;
    height: 270px;
    overflow: auto;
    border-radius: 5px;
    ul.user {
      height: 220px;
      overflow: auto;
    }
    .m_tree {
      line-height: 20px;
      .ivu-tree-title.active {
        background: #03bcb7;
        padding-right: 10px;
        color: #fff;
      }
    }
  }
}
</style>

<template>
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false" width='750'>
    <Form class="g_user_group_form" :model='form' :rules="rules" ref="form" :label-width='100'>
      <FormItem required label='类型：'>
        <RadioGroup v-model="form.grpType">
          <Radio :label='1'>普通用户组</Radio>
          <Radio :label='2'>工单处理组</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem prop="grpName" label='用户组名称：'>
        <Input v-model='form.grpName' clearable placeholder='请输入用户组名称' :maxlength=20></Input>
      </FormItem>
      <FormItem label='角色：'>
        <CheckboxGroup v-model='form.roleIds'>
          <Tooltip :content="item.roleName" placement="top-start" v-for="(item, index) in roleList" :key="index">
            <Checkbox :label="item.roleId">{{item.roleName}}</Checkbox>
          </Tooltip>
        </CheckboxGroup>
      </FormItem>
      <FormItem label='描述：'>
        <Input v-model='form.grpDesc' placeholder='请输入描述' :maxlength=100></Input>
      </FormItem>
      <FormItem label='成员：'>
        <Row :gutter="8">
          <i-col :span="7">
            <div class="m_dept_box">
              <Tree class='m_tree' :data='tree'></Tree>
            </div>
          </i-col>
          <i-col :span="8">
            <div class="m_user_list">
              <Input v-model='searchStr' placeholder='请输入姓名/用户名搜索' />
              <ul class="user">
                <li :key='index' v-for='(item, index) in searchUser'>{{item.name}}/{{item.username}}
                  <Checkbox class="fr" v-model='item.checked' @on-change='change' :true-value="'true-'+ item.userId" :false-value="'false-'+ item.userId" :data-index="item.userId"></Checkbox>
                </li>
              </ul>
            </div>
          </i-col>
          <i-col :span="8">
            <div class="m_target_list">
              <span>已勾选了{{target.length}}位</span>
              <ul class="user">
                <li :key="item.key" v-for="item in target">
                  {{item.name}}/{{item.username}}
                  <Icon class="fr" @click="deleteUserFromTarget(item.userId)" size="18" style="cursor:pointer;margin-top:8px" color="#cecece" type="md-close-circle"></Icon>
                </li>
              </ul>
            </div>
          </i-col>
        </Row>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer">
      <Button @click="ok" class="u_btn u_btn_ok" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UserGroupForm',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      target: [],
      form: {
        grpName: '',
        grpId: '',
        grpType: 1,
        roleIds: [],
        grpDesc: '',
        userIds: []
      },
      searchStr: '',
      deptId: '',
      pageSize: 99999, // 不分页
      rules: {
        grpName: [
          { required: true, message: '用户组名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      roleList: state => state.user.allRoleList,
      userList: state => state.user.userList,
      unitList: state => state.user.organizationalUnit
    }),
    searchUser () {
      return this.userList.filter(u => {
        return u.name.indexOf(this.searchStr) > -1 || u.username.indexOf(this.searchStr) > -1
      })
    },
    tree () {
      let menuTree = []
      if (this.unitList && this.unitList.length) {
        this.unitList.forEach((item) => {
          menuTree.push(this.makeTree(item))
        })
      }
      return menuTree
    }
  },
  mounted () {
    this.$watch('formData', () => {
      if (this.formData.type !== 2) return
      _.forIn(this.form, (val, key) => {
        this.form[key] = this.formData.info[key]
      })
      this.target = []
      this.form.userIds.forEach((item) => {
        const indexInUserList = this.userList.findIndex(i => i.userId === item)
        if (indexInUserList !== -1) {
          this.userList[indexInUserList].checked = `true-${this.userList[indexInUserList].userId}`
        }
        const indexInTarget = this.target.findIndex(v => v.userId === item)
        if (indexInTarget === -1) {
          this.target.push(this.userList[indexInUserList])
        }
      })
    }, { deep: true })
  },
  watch: {
    deptId (current, prev) {
      if (!this.deptId) return
      this.getUserList({ pageSize: this.pageSize, deptId: this.deptId })
        .then(res => {
          this.userList.forEach(item => {
            item.checked = this.form.userIds.findIndex(u => u === item.userId) === -1 ? `false-${item.userId}` : `true-${item.userId}`
          })
        })
    }
  },
  methods: {
    ...mapActions([
      'getUserList'
    ]),
    change (e) {
      const status = e.split('-')
      status[1] = Number(status[1]) // 转成数字以索引来查找数据
      if (status[0] === 'true') {
        // 选中时推到右边
        if (this.target.findIndex(item => item.userId === status[1]) === -1) {
          this.target.push(this.userList[this.userList.findIndex(item => item.userId === status[1])])
          this.form.userIds.push(status[1])
        }
      } else {
        // 取消选中时
        if (this.target.findIndex(item => item.userId === status[1]) !== -1) {
          this.target.splice(this.target.findIndex(item => item.userId === status[1]), 1)
          this.form.userIds.splice(this.form.userIds.findIndex(item => item === status[1]), 1)
        }
      }
    },
    deleteUserFromTarget (deleteUserId) {
      this.target.splice(this.target.findIndex(item => item.userId === deleteUserId), 1)
      this.form.userIds.splice(this.form.userIds.findIndex(item => item === deleteUserId), 1)
      const index = this.userList.findIndex(item => item.userId === deleteUserId)
      if (index === -1) return
      this.userList[index].checked = `false-${deleteUserId}`
    },
    clear () {
      setTimeout(() => {
        this.form = {
          grpName: '',
          grpId: '',
          grpType: 1,
          roleIds: [],
          grpDesc: '',
          userIds: []
        }
        this.target = []
        this.deptId = ''
        this.getUserList({ pageSize: this.pageSize })
        this.$refs.form.resetFields()
      }, 300)
    },
    cancel () {
      this.formData.show = false
      this.clear()
    },
    ok () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.formData.callback(this.form)
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
      return h('span',
        {
          class: 'ivu-tree-title',
          on: {
            click: e => {
              [...document.querySelectorAll('.ivu-tree-title')].forEach(item =>
                item.classList.remove('active')
              )
              e.currentTarget.classList.add('active')
              this.deptId = data.id
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
    }
  }
}
</script>
