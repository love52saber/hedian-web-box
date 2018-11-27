<template>
  <div class="g_role_container">
    <Card class="m_role_content" shadow bordered>
      <div class="m_role_header" slot="title">
        <Button class="u_btn u_btn_add" @click="handleAddBtnClick" type="info" size='large'> 添加 </Button>
        <Button class="u_btn" type="error" @click="handleDeleteBtnClick" size='large'> 删除 </Button>
        <Input class="u_search" v-model="info" @on-search="handleSearch" search enter-button="查询" placeholder="输入指标名称进行搜索，可以使用回车键" />
      </div>
      <Table border ref="selection" :columns="columns" :data="moKpiList" @on-selection-change="selectionChange"></Table>
      <div class="u_page">
        <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <monitor-target-detail :data="detail" />
    <monitor-target-form ref="form" :form-data="formData" />
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { Confirm } from '_c/controls'
import MonitorTargetDetail from '_c/monitor-target/detail'
import MonitorTargetForm from '_c/monitor-target/form'
import '@/view/system-management/safety-management/role.less'
export default {
  name: 'MonitorTarget',
  components: {
    Confirm,
    MonitorTargetDetail,
    MonitorTargetForm
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
        action: '监测指标新增',
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
          title: '指标名称',
          key: 'moKpiName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moKpiName
              }
            }, row.moKpiName)
          }
        },
        {
          title: '关键字',
          key: 'moKpiKey',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moKpiKey
              }
            }, row.moKpiKey)
          }
        }, {
          title: '中文单位',
          key: 'unitCh',
          ellipsis: true,
          width: 120,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.unitCh
              }
            }, row.unitCh)
          }
        }, {
          title: '英文单位',
          key: 'unitEn',
          ellipsis: true,
          width: 120,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.unitEn
              }
            }, row.unitEn)
          }
        }, {
          title: '备注',
          key: 'moKpiDesc',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moKpiDesc
              }
            }, row.moKpiDesc)
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
                    this.formData.action = '监测指标修改'
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
                    this.confirm.operator = row.moKpiName
                    this.confirm.action = '删除'
                    this.confirm.callback = this.delete
                    this.confirm.id = row.moKpiId
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
      showConfirmModal: state => state.app.showConfirmModal,
      moKpiList: state => state.device.moKpiList,
      moKpiTotal: state => state.device.moKpiTotal
    }),
    total () {
      if (this.moKpiTotal >= this.pageSize && this.moKpiTotal.length === 0) this.pageIndex -= 1
      return this.moKpiTotal
    }
  },
  created () {
    this.getMoKpiList({})
  },
  methods: {
    ...mapActions([
      'getMoKpiList',
      'addMoKpi',
      'updateMoKpi',
      'deleteMoKpi'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    handleSearch () {
      this.getMoKpiList({ info: this.info, pageIndex: 1 })
    },
    handleAddBtnClick () {
      this.formData.show = true
      this.formData.action = '监测指标新增'
      this.formData.callback = this.add
      this.formData.type = 1
      this.formData.info = {}
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先勾选指标再进行删除' })
      this.confirm.operator = '所勾选的指标'
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
        this.selectedIds.push(item.moKpiId)
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
      this.addMoKpi(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '指标新增成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getMoKpiList({ pageIndex: this.pageIndex })
      })
    },
    update (params) {
      this.updateMoKpi(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '指标修改成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getMoKpiList({ pageIndex: this.pageIndex })
      })
    },
    delete (grpId, isFinal = false) {
      this.deleteMoKpi(grpId).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '指标删除成功' })
        this.setShowConfirmModal(false)
        this.getMoKpiList({ pageIndex: this.pageIndex })
      })
    }
  }
}
</script>
