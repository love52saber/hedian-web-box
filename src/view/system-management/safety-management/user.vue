<template>
  <div class="g_user_container">
    <Row :gutter="16" style="height:100%">
      <i-col style="height:100%" :span="5">
        <Card class="m_user_left" shadow bordered>
          <h4 slot="title">选择组织单位</h4>
          <Tree :data="tree"></Tree>
        </Card>
      </i-col>
      <i-col style="height:100%" :span="19">
        <Card class="m_user_right" shadow bordered>
          <div class="m_role_header" slot="title">
            <Button class="u_btn u_btn_add" @click="handleAddBtnClick" type="info" size='large'> 添加 </Button>
            <Button class="u_btn" type="error" @click="handleDeleteBtnClick" size='large'> 删除 </Button>
            <Button class="u_btn" v-if="deptId !== ''" @click="deptId = ''" type="primary" size='large'> 全部 </Button>
            <Input class="u_search" v-model="info" @on-search="handleSearch" search enter-button="查询" placeholder="输入用户名或姓名进行搜索,可以使用回车键" />
          </div>
          <Table border ref="selection" :columns="columns" :data="userList" @on-selection-change="selectionChange"></Table>
          <div class="u_page">
            <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
          </div>
        </Card>
      </i-col>
      <user-detail :data="detail" />
      <user-form ref="form" :form-data="formData" />
      <confirm :show="showConfirmModal" :operator="confirm.operator" :action="confirm.action" :on-ok="confirm.callback" :confirm-id="confirm.id" />
    </Row>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import UserDetail from '_c/user/detail.vue'
import UserForm from '_c/user/form.vue'
import { Confirm } from '_c/controls'
import './user.less'
export default {
  name: 'UserManagement',
  components: {
    UserDetail,
    UserForm,
    Confirm
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 15,
      info: '',
      deptId: '',
      selectedIds: [],
      detail: {
        show: false,
        data: {}
      },
      formData: {
        show: false,
        action: '新增用户',
        callback: null,
        type: 1, // 新增1， 修改2
        info: {}
      },
      confirm: {
        operator: '',
        action: '',
        id: '',
        callback: this.delete
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'userId',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.userId
              }
            }, row.userId)
          }
        },
        {
          title: '姓名',
          key: 'name',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.name
              }
            }, row.name)
          }
        },
        {
          title: '用户名',
          key: 'username',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.username
              }
            }, row.username)
          }
        },
        {
          title: '手机号码',
          key: 'mobile',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mobile
              }
            }, row.mobile)
          }
        },
        {
          title: '固定电话',
          key: 'telephone',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.telephone
              }
            }, row.telephone)
          }
        },
        {
          title: '状态',
          key: 'status',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('div', [
              h('span', {
                style: {
                  color: row.status === 0 ? '#f00' : '#000'
                }
              }, row.status === 1 ? '正常' : '禁用')
            ])
          }
        },
        {
          title: '锁定状态',
          key: 'lockflag',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('div', [
              h('span', {
                style: {
                  color: !row.lockflag ? '#000' : '#f00'
                }
              }, !row.lockflag ? '正常' : '锁定')
            ])
          }
        },
        {
          title: '操作',
          width: 160,
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: window.config.DETAIL_ICON,
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '查看'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.detail.data = row
                    this.detail.show = true
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: window.config.UPDATE_ICON,
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '修改'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.formData.show = true
                    this.formData.info = row
                    this.formData.action = '用户修改'
                    this.formData.type = 2
                    this.formData.callback = this.update
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: !row.lockflag ? 'md-unlock' : 'md-lock',
                  color: !row.lockflag ? '#04bbb7' : '#f00',
                  size: 20
                },
                attrs: {
                  title: !row.lockflag ? '点击锁定' : '点击解锁'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.confirm.operator = row.name
                    this.confirm.action = !row.lockflag ? '锁定' : '解锁'
                    this.confirm.id = row.userId
                    this.confirm.callback = this.lock
                    this.setShowConfirmModal(true)
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: window.config.DELETE_ICON,
                  color: !row.delflag ? '#ccc' : '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: !row.delflag ? '不可删除' : '删除'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (!row.delflag) return
                    this.confirm.action = '删除'
                    this.confirm.operator = row.name
                    this.confirm.id = row.userId
                    this.confirm.callback = this.delete
                    this.setShowConfirmModal(true)
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
    this.getOrganizationalUnit()
    this.getAllRoleList()
    this.getUserList({})
  },
  computed: {
    ...mapState({
      unitList: state => state.user.organizationalUnit,
      showConfirmModal: state => state.app.showConfirmModal,
      userList: state => state.user.userList,
      userTotal: state => state.user.userTotal
    }),
    total () {
      if (this.userTotal >= this.pageSize && this.userList.length === 0) this.pageIndex -= 1
      return this.userTotal
    },
    tree () {
      let tree = []
      if (this.unitList && this.unitList.length) {
        this.unitList.forEach(item => {
          tree.push(this.makeTree(item))
        })
      }
      return tree
    }
  },
  watch: {
    pageIndex (current, prev) {
      this.getUserList({ pageIndex: this.pageIndex, info: this.info, deptId: this.deptId })
    },
    deptId (current, prev) {
      this.getUserList({ pageIndex: this.pageIndex, info: this.info, deptId: this.deptId })
    }
  },
  methods: {
    ...mapActions([
      'getOrganizationalUnit',
      'getAllRoleList',
      'getUserList',
      'addUser',
      'updateUser',
      'lockUser',
      'deleteUser'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    pageChanged (e) {
      this.pageIndex = e
    },
    selectionChange (e) { // 表格勾选事件
      this.selectedIds = []
      e.map((item) => {
        this.selectedIds.push(item.userId)
      })
    },
    handleAddBtnClick () {
      this.formData = {
        show: true,
        action: '新增用户',
        callback: this.add,
        type: 1, // 新增1， 修改2
        info: {}
      }
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先勾选用户再进行删除' })
      this.confirm.operator = '所勾选的用户'
      this.confirm.action = '删除'
      this.confirm.callback = this.batchDelete
      this.confirm.id = ''
      this.setShowConfirmModal(true)
    },
    batchDelete () {
      this.selectedIds.forEach((item, index, arr) => {
        if (index === this.selectedIds.length - 1) {
          this.delete(item, true)
          this.selectedIds = []
        } else this.delete(item)
      })
    },
    handleSearch () {
      this.getUserList({ info: this.info, pageIndex: 1 })
    },
    add (params) {
      this.addUser(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '用户新增成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getUserList({ pageIndex: this.pageIndex })
      })
    },
    update (params) {
      this.updateUser(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '用户修改成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getUserList({ pageIndex: this.pageIndex })
      })
    },
    delete (userId, isFinal = false) {
      this.deleteUser(userId).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '用户删除成功' })
        this.setShowConfirmModal(false)
        this.getUserList({ pageIndex: this.pageIndex })
      })
    },
    lock (userId, isFinal, lockInfo) {
      this.lockUser({ userId, lockInfo }).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: `用户${lockInfo === 'lock' ? '锁定' : '解锁'}成功` })
        this.setShowConfirmModal(false)
        this.getUserList({ pageIndex: this.pageIndex })
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
            click: () => {
              this.deptId = data.id
            }
          }
        },
        [
          h('span', {
            class: 'device-status'
          }),
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
