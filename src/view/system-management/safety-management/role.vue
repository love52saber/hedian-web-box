<template>
  <div class="g_role_container">
    <Card class="m_role_content" shadow bordered>
      <div class="m_role_header" slot="title">
        <Button class="u_btn u_btn_add" @click="handleAddBtnClick" type="info" size='large'> 添加 </Button>
        <Button class="u_btn" type="error" @click="handleDeleteBtnClick" size='large'> 删除 </Button>
        <Input class="u_search" v-model="info" @on-search="handleSearch" search enter-button="查询" placeholder="输入角色名称进行搜索" />
      </div>
      <Table border ref="selection" :columns="columns" :data="roleList" @on-selection-change="selectionChange"></Table>
      <div class="u_page">
        <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <role-form ref="form" :menu="menuTree" :form-data="formData" />
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import RoleForm from '_c/role/form'
import { Confirm } from '_c/controls'
import './role.less'
export default {
  name: 'RoleManagement',
  components: {
    RoleForm,
    Confirm
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 15,
      info: '',
      selectedIds: [],
      confirm: {
        operator: '',
        action: '',
        id: '',
        callback: this.delete
      },
      formData: { // 表单数据
        action: '角色新增',
        show: false,
        callback: null,
        type: 1, // 1是新增, 2是修改，0是详情
        info: {}
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'roleId',
          sortable: true,
          ellipsis: true,
          width: 80,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.roleId
              }
            }, row.roleId)
          }
        },
        {
          title: '角色名称',
          key: 'roleName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.roleName
              }
            }, row.roleName)
          }
        },
        {
          title: '备注',
          key: 'remark',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.remark
              }
            }, row.remark)
          }
        },
        {
          title: '操作',
          width: 120,
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
                  title: '详情'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.formData.action = '角色详情'
                    this.formData.callback = null
                    this.formData.info = row
                    this.formData.type = 0
                    this.formData.show = true
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
                    this.formData.action = '角色修改'
                    this.formData.callback = this.update
                    this.formData.info = row
                    this.formData.type = 2
                    this.formData.show = true
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: window.config.DELETE_ICON,
                  color: row.delflag ? '#04bbb7' : '#ccc',
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
                    if (!row.delflag) return
                    this.confirm.operator = row.roleName
                    this.confirm.action = '删除'
                    this.confirm.callback = this.delete
                    this.confirm.id = row.roleId
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
    this.getRoleList({})
    this.getMenuTreeData()
  },
  computed: {
    ...mapState({
      roleList: state => state.user.roleList,
      roleTotal: state => state.user.roleTotal,
      menuTree: state => state.user.menuTreeData,
      showConfirmModal: state => state.app.showConfirmModal
    }),
    total () {
      if (this.roleTotal >= this.pageSize && this.roleList.length === 0) this.pageIndex -= 1
      return this.roleTotal
    }
  },
  watch: {
    pageIndex (current, pre) {
      this.getRoleList({ pageIndex: this.pageIndex, info: this.info })
    }
  },
  methods: {
    ...mapActions([
      'getRoleList',
      'getMenuTreeData',
      'addRole',
      'updateRole',
      'deleteRole'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    handleSearch () {
      this.getRoleList({ info: this.info, pageIndex: 1 })
    },
    handleAddBtnClick () {
      this.formData.show = true
      this.formData.action = '角色新增'
      this.formData.callback = this.add
      this.formData.type = 1
      this.formData.info = {}
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先勾选角色再进行删除' })
      this.confirm.operator = '所勾选的角色'
      this.confirm.action = '删除'
      this.confirm.callback = this.batchDelete
      this.confirm.id = ''
      this.setShowConfirmModal(true)
    },
    pageChanged (e) {
      this.pageIndex = e
    },
    batchDelete () {
      this.selectedIds.forEach((item, index, arr) => {
        if (index === this.selectedIds.length - 1) {
          this.delete(item, true)
          this.selectedIds = []
        } else this.delete(item)
      })
    },
    selectionChange (e) { // 表格勾选事件
      this.selectedIds = []
      e.map((item) => {
        this.selectedIds.push(item.roleId)
      })
    },
    add (params) {
      this.addRole(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '角色新增成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getRoleList({ pageIndex: this.pageIndex })
      })
    },
    update (params) {
      this.updateRole(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '角色更新成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getRoleList({ pageIndex: this.pageIndex })
      })
    },
    delete (roleId, isFinal = false) {
      this.deleteRole(roleId).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '角色删除成功' })
        this.setShowConfirmModal(false)
        this.getRoleList({ pageIndex: this.pageIndex })
      })
    }
  }
}
</script>
