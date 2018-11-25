<template>
  <div class="g_role_container">
    <Card class="m_role_content" shadow bordered>
      <div class="m_role_header" slot="title">
        <Button class="u_btn u_btn_add" @click="handleAddBtnClick" type="info" size='large'> 添加 </Button>
        <Button class="u_btn" type="error" @click="handleDeleteBtnClick" size='large'> 删除 </Button>
        <Input class="u_search" v-model="info" @on-search="handleSearch" search enter-button="查询" placeholder="输入维护域名称进行搜索，可以使用回车键" />
      </div>
      <Table border ref="selection" :columns="columns" :data="mdList" @on-selection-change="selectionChange"></Table>
      <div class="u_page">
        <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
    <maintain-domain-detail :data="detail" />
    <maintain-domain-form ref="form" :form-data="formData" />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { Confirm } from '_c/controls'
import MaintainDomainDetail from '_c/maintain-domain/detail.vue'
import MaintainDomainForm from '_c/maintain-domain/form.vue'
import '@/view/system-management/safety-management/role.less'
export default {
  name: 'MaintenanceDomain',
  components: {
    Confirm,
    MaintainDomainDetail,
    MaintainDomainForm
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
      detail: {
        show: false,
        data: {}
      },
      formData: { // 表单数据
        action: '维护域新增',
        show: false,
        callback: null,
        type: 1, // 1是新增, 2是修改
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
          key: 'mdId',
          align: 'center',
          width: 80,
          sortable: true,
          ellipsis: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdId
              }
            }, row.mdId)
          }
        },
        {
          title: '名称',
          key: 'mdName',
          align: 'center',
          ellipsis: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdName
              }
            }, row.mdName)
          }
        },
        {
          title: '描述',
          align: 'center',
          key: 'mdDesc',
          ellipsis: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdDesc
              }
            }, row.mdDesc)
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
                  type: 'md-eye',
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
                    this.detail.data = row
                    this.detail.show = true
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'md-create',
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
                    this.formData.action = '维护域修改'
                    this.formData.callback = this.update
                    this.formData.info = row
                    this.formData.type = 2
                    this.formData.show = true
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'md-trash',
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
                    this.confirm.operator = row.mdName
                    this.confirm.action = '删除'
                    this.confirm.callback = this.delete
                    this.confirm.id = row.mdId
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
  computed: {
    ...mapState({
      roleList: state => state.user.roleList,
      mdTotal: state => state.device.mdTotal,
      mdList: state => state.device.maintainDomainList,
      showConfirmModal: state => state.app.showConfirmModal
    }),
    total () {
      if (this.mdTotal >= this.pageSize && this.mdList.length === 0) this.pageIndex -= 1
      return this.mdTotal
    }
  },
  created () {
    this.getMaintainDomainList({})
    this.getOrganizationalUnit()
  },
  methods: {
    ...mapActions([
      'getMaintainDomainList',
      'addMaintainDomain',
      'updateMaintainDomain',
      'deleteMaintainDomain',
      'getOrganizationalUnit'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    handleSearch () {
      this.getMaintainDomainList({ info: this.info, pageIndex: 1 })
    },
    handleAddBtnClick () {
      this.formData.show = true
      this.formData.action = '维护域新增'
      this.formData.callback = this.add
      this.formData.type = 1
      this.formData.info = {}
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先勾选维护域再进行删除' })
      this.confirm.operator = '所勾选的维护域'
      this.confirm.action = '删除'
      this.confirm.callback = this.batchDelete
      this.confirm.id = ''
      this.setShowConfirmModal(true)
    },
    pageChanged (e) {
      this.pageIndex = e
    },
    selectionChange (e) { // 表格勾选事件
      this.selectedIds = []
      e.map((item) => {
        this.selectedIds.push(item.mdId)
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
    add (params) {
      this.addMaintainDomain(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '维护域新增成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getMaintainDomainList({ pageIndex: this.pageIndex })
      })
    },
    update (params) {
      this.updateMaintainDomain(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '维护域修改成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getMaintainDomainList({ pageIndex: this.pageIndex })
      })
    },
    delete (grpId, isFinal = false) {
      this.deleteMaintainDomain(grpId).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '维护域删除成功' })
        this.setShowConfirmModal(false)
        this.getMaintainDomainList({ pageIndex: this.pageIndex })
      })
    }
  }
}
</script>
