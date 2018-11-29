<style lang="less">
.g_TB_container {
  // border: 1px red solid;
  padding: 15px;
  .m_bottom_content {
    height: 100%;
  }
}
</style>

<template>
  <div class="g_TB_container">
    <Card class="m_top_content mb20" shadow bordered>
      <Form :label-width="100">
        <Row :gutter="80">
          <i-col :span="8">
            <FormItem label="标题：">
              <Input v-model="form.msTitle" placeholder="请输入标题" />
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem label="类型：">
              <Select v-model="form.msType">
                <Option :value="''">全部</Option>
                <Option v-for="item in msTypeEnumeration" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem label="状态：">
              <Select v-model="form.msStatus">
                <Option v-for="item in msStatusEnumeration" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :push="18" :span="6">
            <Checkbox :true-value='1' :false-value='0' v-model="form.currentTime">当前有效期</Checkbox>
            <Button @click.stop="query" class="mr20" type="primary">查询</Button>
            <Button @click.stop="empty" type="default">重置</Button>
          </i-col>
        </Row>
      </Form>
    </Card>

    <Card class="m_bottom_content" shadow bordered>
      <div class="m_role_header" slot="title">
        <Button class="u_btn u_btn_add mr20" @click="handleAddBtnClick" type="info" size='large'> 添加 </Button>
        <Button class="u_btn" type="error" @click="handleDeleteBtnClick" size='large'> 删除 </Button>
      </div>
      <Table border ref="selection" height="503" :columns="columns" @on-selection-change="selectionChange" :data="msList" />
      <div class="u_page">
        <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <maintain-strategy-form ref="form" :form-data="formData" />
    <maintain-strategy-detail :data="detail" />
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { Confirm } from '_c/controls'
import MaintainStrategyForm from '_c/maintain-strategy/form'
import MaintainStrategyDetail from '_c/maintain-strategy/detail'
export default {
  name: 'MaintainStrategy',
  components: { Confirm, MaintainStrategyForm, MaintainStrategyDetail },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      selectedIds: [],
      form: {
        msTitle: '', // 标题
        msType: '', // 类型
        msStatus: '', // 状态
        currentTime: 0 // 当前有效期
      },
      formData: {
        show: false,
        action: '维护期策略新增',
        type: 1, // 1 新增 2修改
        callback: null,
        info: {}
      },
      detail: {
        show: false,
        info: {}
      },
      confirm: {
        operator: '',
        action: '',
        id: '',
        callback: this.delete
      },
      msType: {
        '1': '新建',
        '2': '维护',
        '3': '扩建',
        '4': '割接',
        '5': '其他'
      },
      msStatusEnumeration: [
        {
          value: '',
          label: '全部'
        }, {
          value: 1,
          label: '启用'
        }, {
          value: 2,
          label: '停用'
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'msId',
          ellipsis: true,
          align: 'center',
          width: 80,
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.msId
              }
            }, row.msId)
          }
        },
        {
          title: '维护期标题',
          key: 'msName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.msName
              }
            }, row.msName)
          }
        },
        {
          title: '类型',
          key: 'msType',
          ellipsis: true,
          align: 'center',
          width: 120,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: this.msType[row.msType]
              }
            }, this.msType[row.msType])
          }
        },
        {
          title: '开始时间',
          key: 'beginTime',
          ellipsis: true,
          align: 'center',
          width: 150,
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.beginTime
              }
            }, row.beginTime)
          }
        },
        {
          title: '结束时间',
          key: 'endTime',
          ellipsis: true,
          align: 'center',
          sortable: true,
          width: 150,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.endTime
              }
            }, row.endTime)
          }
        },
        {
          title: '状态',
          key: 'msStatus',
          ellipsis: true,
          align: 'center',
          sortable: true,
          width: 80,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.msStatus === 1 ? '启用' : '停用'
              }
            }, row.msStatus === 1 ? '启用' : '停用')
          }
        },
        {
          title: '描述',
          key: 'msDesc',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.msDesc
              }
            }, row.msDesc)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-eye',
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
                    console.log(row)
                    this.detail.info = row
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
                    this.formData.action = '维护期策略修改'
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
                    this.confirm.callback = this.delete
                    this.confirm.action = '删除'
                    this.confirm.operator = row.msName
                    this.confirm.id = row.msId
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
    this.getMaintainStrategyList({})
  },
  watch: {
    pageIndex () {
      this.getMaintainStrategyList({ pageIndex: this.pageIndex })
    }
  },
  computed: {
    ...mapState({
      msList: state => state.abnormal.maintainStrategyList,
      msTotal: state => state.abnormal.maintainStrategyTotal,
      showConfirmModal: state => state.app.showConfirmModal,
      msTypeEnumeration: state => state.abnormal.maintainType
    }),
    total () {
      if (this.msTotal >= this.pageSize && this.msTotal.length === 0) this.pageIndex -= 1
      return this.msTotal
    }
  },
  methods: {
    ...mapActions([
      'getMaintainStrategyList',
      'deleteMaintainStrategy',
      'addMaintainStrategy',
      'updateMaintainStrategy'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    selectionChange (e) { // 表格选择事件
      this.selectedIds = []
      e.forEach(item => {
        this.selectedIds.push(item.msId)
      })
    },
    pageChanged (e) { // 页码变化更新
      this.pageIndex = e
    },
    handleAddBtnClick () {
      this.formData.show = true
      this.formData.action = '维护期策略新增'
      this.formData.callback = this.add
      this.formData.type = 1
      this.formData.info = {}
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先勾选维护期策略再进行删除' })
      this.confirm.operator = '所勾选的维护期策略'
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
    query () { // 查询按钮点击事件
      this.getMaintainStrategyList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
    },
    empty () { // 重置按钮点击事件
      this.form = {
        msTitle: '', // 标题
        msType: '', // 类型
        msStatus: '', // 状态
        currentTime: 0 // 当前有效期
      }
      this.getMaintainStrategyList({ pageSize: this.pageSize })
    },
    add (params) {
      this.addMaintainStrategy(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '维护期策略新增成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getMaintainStrategyList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
      })
    },
    update (params) {
      this.updateMaintainStrategy(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '维护期策略修改成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getMaintainStrategyList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
      })
    },
    delete (skId, isFinal = false) {
      this.deleteMaintainStrategy(skId).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '维护期策略删除成功' })
        this.setShowConfirmModal(false)
        this.getMaintainStrategyList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
      })
    }
  }
}
</script>
