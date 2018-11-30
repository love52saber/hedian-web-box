<template>
  <div class="g_role_container">
    <Card class="m_role_content" shadow bordered>
      <div class="m_role_header" slot="title">
        <Button class="u_btn u_btn_add" @click="handleAddBtnClick" type="info" size='large'> 添加 </Button>
        <Button class="u_btn" type="error" @click="handleDeleteBtnClick" size='large'> 删除 </Button>
        <Input class="u_search" v-model="grpName" @on-search="handleSearch" search enter-button="查询" placeholder="输入用户组名称进行搜索,可以使用回车键" />
      </div>
      <Table border ref="selection" :columns="columns" :data="userGroupList" @on-selection-change="selectionChange"></Table>
      <div class="u_page">
        <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <user-group-detail :data="detail" />
    <user-group-form ref="form" :form-data="formData" />
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
  </div>
</template>
<script>
import './role.less'
import { Confirm } from '_c/controls'
import UserGroupDetail from '_c/user-group/detail.vue'
import UserGroupForm from '_c/user-group/form.vue'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'UserGroupManagement',
  components: {
    Confirm,
    UserGroupDetail,
    UserGroupForm
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 15,
      grpName: '',
      selectedIds: [],
      detail: {
        show: false,
        data: {}
      },
      formData: {
        show: false,
        action: '新增用户组',
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
          key: 'grpId',
          width: 80,
          sortable: true,
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.grpId
              }
            }, row.grpId)
          }
        },
        {
          title: '用户组名',
          key: 'grpName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.grpName
              }
            }, row.grpName)
          }
        },
        {
          title: '用户组类型',
          key: 'grpType',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.grpType === 1 ? '普通用户组' : '工单处理组'
              }
            }, row.grpType === 1 ? '普通用户组' : '工单处理组')
          }
        },
        {
          title: '描述',
          key: 'grpDesc',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.grpDesc
              }
            }, row.grpDesc)
          }
        },
        {
          title: '操作',
          width: 150,
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
                    this.detail.show = true
                    this.detail.data = row
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
                    this.formData = {
                      action: '修改用户组',
                      callback: this.update,
                      type: 2,
                      info: row,
                      show: true
                    }
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
                    this.confirm.operator = row.grpName
                    this.confirm.callback = this.delete
                    this.confirm.id = row.grpId
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
    this.getUserGroupList({})
    this.getAllRoleList()
    this.getUserList({ pageSize: 9999 })
    this.getOrganizationalUnit()
  },
  computed: {
    ...mapState({
      userGroupList: state => state.user.userGroupList,
      userGroupTotal: state => state.user.userGroupTotal,
      showConfirmModal: state => state.app.showConfirmModal
    }),
    total () {
      if (this.userGroupTotal >= this.pageSize && this.userGroupList.length === 0) this.pageIndex -= 1
      return this.userGroupTotal
    }
  },
  watch: {
    pageIndex (current, pre) {
      this.getUserGroupList({ pageIndex: this.pageIndex, grpName: this.grpName })
    }
  },
  methods: {
    ...mapActions([
      'getOrganizationalUnit',
      'getUserGroupList',
      'getAllRoleList',
      'getUserList',
      'updateUserGroup',
      'addUserGroup',
      'deleteUserGroup'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    handleAddBtnClick () {
      this.formData = {
        show: true,
        action: '新增用户组',
        callback: this.add,
        type: 1, // 新增1， 修改2
        info: {}
      }
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先勾选用户组再进行删除' })
      this.confirm.operator = '所勾选的用户组'
      this.confirm.action = '删除'
      this.confirm.callback = this.batchDelete
      this.confirm.id = ''
      this.setShowConfirmModal(true)
    },
    handleSearch () {
      this.getUserGroupList({ grpName: this.grpName, pageIndex: 1 })
    },
    pageChanged (e) { // 页码跳转
      this.pageIndex = e
    },
    selectionChange (e) {
      this.selectedIds = []
      e.map((item) => {
        this.selectedIds.push(item.grpId)
      })
    },
    add (params) {
      this.addUserGroup(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '用户组新增成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getUserGroupList({ pageIndex: this.pageIndex })
      })
    },
    update (params) {
      this.updateUserGroup(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '用户组修改成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getUserGroupList({ pageIndex: this.pageIndex })
      })
    },
    batchDelete () {
      this.selectedIds.forEach((item, index, arr) => {
        if (index === this.selectedIds.length - 1) {
          this.delete(item, true)
          this.selectedIds = []
        } else this.delete(item)
      })
    },
    delete (grpId, isFinal = false) {
      this.deleteUserGroup(grpId).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '用户组删除成功' })
        this.setShowConfirmModal(false)
        this.getUserGroupList({ pageIndex: this.pageIndex })
      })
    }
  }
}
</script>
