<style lang="less">
.g_user_group_form {
  .m_dept_box,
  .m_user_list,
  .m_target_list {
    border: 1px #cecece solid;
    padding: 5px;
    height: 320px;
    overflow: auto;
    border-radius: 5px;
    ul.user {
      height: 270px;
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
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false" width='1000'>
    <Form class="g_user_group_form mr30" :model='form' :rules="rules" ref="form" :label-width='100'>
      <FormItem prop="mdName" label='维护域名称：'>
        <Input v-model="form.mdName" placeholder='输入维护域名称' :maxlength="20" />
      </FormItem>
      <FormItem label='维护域描述：'>
        <Input v-model="form.mdDesc" placeholder='输入维护域描述' :maxlength="100" />
      </FormItem>
      <FormItem label='配置：'>
        <Tabs v-model="defaultTab" type="card">
          <TabPane name="1" label="资源信息">
            <Button class="mb10 mr10" @click='resourceShow = true' type="info">添加</Button>
            <Button class="mb10" @click='deleteRes' type="error">删除</Button>
            <Table border no-data-text="请添加资源" ref="selection" height="335" @on-selection-change="selectChange" :columns="columns" :data="resource"></Table>
          </TabPane>
          <TabPane name="2" label="单位信息">
            <Tree class='m_tree' show-checkbox @on-check-change='treeSelect' :data='tree'></Tree>
          </TabPane>
          <TabPane name="3" label="个人信息">
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
          </TabPane>
        </Tabs>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer">
      <Button @click="ok" class="u_btn u_btn_ok" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
    <resource ref="resource" :show="resourceShow" :pattern="1" :is-fixed-main-type="true" @callback="selectResCallback" />
  </Modal>
</template>
<script>
import { Resource } from '_c/controls'
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  name: 'MaintainDomainForm',
  components: {
    Resource
  },
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      resourceShow: false,
      defaultTab: '1',
      searchStr: '',
      target: [],
      pageSize: 99999,
      form: {
        mdName: '',
        mdDesc: '',
        showorder: 100,
        deptIds: [],
        userIds: [],
        resIds: [],
        mdId: ''
      },
      selectedIds: [],
      selectedResData: [],
      rules: {
        mdName: [
          { required: true, message: '维护域名称不能为空', trigger: 'blur' }
        ]
      },
      columns: [
        {
          title: '选择',
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编码',
          key: 'resSerialnumber',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resSerialnumber
              }
            }, row.resSerialnumber)
          }
        },
        {
          title: '名称',
          key: 'resName',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resName
              }
            }, row.resName)
          }
        },
        {
          title: '别名',
          key: 'resAlias',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAlias
              }
            }, row.resAlias)
          }
        },
        {
          title: '主类型',
          key: 'resMainType',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resMainType.resMtypeName
              }
            }, row.resMainType.resMtypeName)
          }
        },
        {
          title: '子类型',
          key: 'resSubtype',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resSubtype.resStypeName
              }
            }, row.resSubtype.resStypeName)
          }
        },
        {
          title: 'IP地址',
          key: 'resIpv4',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resIpv4
              }
            }, row.resIpv4)
          }
        },
        {
          title: '地址信息',
          key: 'resAddress',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          width: 170,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAddress
              }
            }, row.resAddress)
          }
        },
        {
          title: '操作',
          width: 70,
          align: 'center',
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-trash',
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '删除'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.form.resIds.splice(this.form.resIds.findIndex(item => item === row.resId), 1)
                    this.$refs.resource.toggleSelect(row)
                  }
                }
              })
            ])
          }
        }
      ]
    }
  },
  created () {
    this.getUserList({ pageSize: this.pageSize })
  },
  mounted () {
    this.$watch('formData', () => {
      if (this.formData.type !== 2) return
      _.forIn(this.form, (val, key) => {
        this.form[key] = this.formData.info[key]
      })
    }, { deep: true })
  },
  computed: {
    ...mapState({
      resList: state => state.device.resList,
      unitList: state => state.user.organizationalUnit,
      userList: state => state.user.userList
    }),
    searchUser () { // 绑定搜索框
      this.userList.forEach((item, index, arr) => {
        item.checked = this.form.userIds.findIndex(i => i === item.userId) === -1 ? 'false-' + item.userId : 'true-' + item.userId
        if (item.checked.split('-')[0] === 'true') {
          if (this.target.findIndex(t => t.userId === item.userId) === -1) {
            this.target.push(item)
          }
        }
      })
      return this.userList.filter(u => {
        return u.name.indexOf(this.searchStr) > -1 || u.username.indexOf(this.searchStr) > -1
      })
    },
    resource () {
      let res = []
      this.resList.forEach(item => {
        if (this.form.resIds.findIndex(i => i === item.resId) > -1) {
          res.push(item)
        }
      })
      return res
    },
    tree () { // 部门机构树数据
      let menuTree = []
      if (this.unitList && this.unitList.length) {
        this.unitList.forEach(item => {
          menuTree.push(this.makeTree(item))
        })
      }
      return menuTree
    }
  },
  methods: {
    ...mapActions([
      'getUserList'
    ]),
    deleteRes () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '未选择资源' })
      this.selectedIds.forEach(item => {
        const list = this.resList
        this.$refs.resource.toggleSelect(list.find(res => res.resId === item)) // 更改资源组件的勾选状态
        this.form.resIds.splice(this.form.resIds.findIndex(r => r === item)) // 更新当前页面的表格数据
      })
      this.selectedIds = []
    },
    selectChange (e) {
      this.selectedIds = []
      e.map(item => this.selectedIds.push(item.resId))
    },
    treeSelect (e) { // 树形控件选择状态监控，并构建deptIds数据集
      this.form.deptIds = []
      e.map(item => {
        this.form.deptIds.push(item.id)
      })
    },
    selectResCallback (data) { // 选择资源组件向新增组件数据传递fun
      this.resourceShow = false
      if (data.handle === 'cancel') return
      this.selectedResData = data.array
      this.form.resIds = []
      data.array.map(item => {
        this.form.resIds.push(item.resId)
      })
    },
    ok () { // 确定点击事件
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.formData.callback(this.form)
      })
    },
    cancel () { // 取消点击事件
      this.formData.show = false
      this.clear()
    },
    clear () { // 清空表单数据
      this.$refs.form.resetFields()
      setTimeout(() => {
        this.form = {
          mdName: '',
          mdDesc: '',
          showorder: 100,
          deptIds: [],
          userIds: [],
          resIds: [],
          mdId: ''
        }
        this.target = []
        this.defaultTab = '1'
        this.searchStr = ''
      }, 300)
    },
    deleteUserFromTarget (deleteUserId) { // 删除icon点击事件
      const users = this.userList
      this.target.splice(this.target.findIndex(item => item.userId === deleteUserId), 1)
      this.form.userIds.splice(this.form.userIds.findIndex(item => item === deleteUserId), 1)
      const index = this.userList.findIndex(item => item.userId === deleteUserId)
      if (index === -1) return
      users[index].checked = `false-${deleteUserId}`
    },
    change (e) { // 选择人员点击checkbox勾选事件
      const status = e.split('-')
      const users = this.userList
      status[1] = Number(status[1]) // 转成数字以索引来查找数据
      if (status[0] === 'true') {
        // 选中时推到右边
        if (this.target.findIndex(item => item.userId === status[1]) === -1) {
          this.target.push(users[users.findIndex(item => item.userId === status[1])])
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
    makeTree (node) {
      let n = {
        id: node.deptId,
        title: node.name,
        expand: true,
        render: this.render,
        checked: !!(this.formData.info.deptIds && this.formData.info.deptIds.length && this.formData.info.deptIds.findIndex(item => item === node.deptId) > -1),
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
            click: e => {
              if (this.defaultTab === '2') return // 当前是单位信息标签页时，不做处理
              [...document.querySelectorAll('.ivu-tree-title')].forEach(item => {
                item.classList.remove('active')
              })
              e.currentTarget.classList.add('active')
              this.getUserList({ deptId: data.id, pageSize: this.pageSize })
            }
          }
        }, [h('span', [
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
        ])]
      )
    }
  }
}
</script>
