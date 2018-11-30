<style lang="less">
.g_TB_container {
  padding: 15px;
  .m_bottom_content {
    height: 100%;
  }
}
</style>
<template>
  <div class="g_TB_container">
    <Card class="m_top_content mb10" shadow bordered>
      <Form :label-width="100">
        <Row :gutter="80">
          <i-col :span="8">
            <FormItem class="mb10" label="名称：">
              <Input v-model="form.fmsName" placeholder='请输入策略名称作为搜索条件' />
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="维护单位：">
              <Input readonly v-model="form.deptName" @on-click='deptShow = !deptShow' placeholder='请选择维护单位' :icon="deptShow ? 'ios-arrow-up' : 'ios-arrow-down'" />
              <div v-show="deptShow" style="border:1px #ccc solid;position:absolute;z-index:999;width:100%;height:200px;background:#fff;overflow:auto">
                <Tree class='m_tree' :data='tree'></Tree>
              </div>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="维护人：">
              <Input v-model="form.userName" placeholder="请输入维护人作为搜索条件"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="工单处理组：">
              <Input v-model="form.grpName" placeholder="请输入工单组名称作为搜索条件"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="自动派单：">
              <Select v-model="form.dispatchflag" placeholder='请选择派单类型'>
                <Option :value="''">全部</Option>
                <Option :value="1">是</Option>
                <Option :value="0">否</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="状态：">
              <Select v-model="form.fmsStatus" placeholder='请选择策略状态'>
                <Option :value="''">全部</Option>
                <Option :value="1">启用</Option>
                <Option :value="0">禁用</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :push="18" :span="6">
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
      <Table border ref="selection" height="503" :columns="columns" @on-selection-change="selectionChange" :data="fmsList" />
      <div class="u_page">
        <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <fault-maintain-strategy-form ref="form" :form-data="formData" />
    <fault-maintain-strategy-detail :data="detail" />
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { Confirm } from '_c/controls'
import FaultMaintainStrategyForm from '_c/fault-maintain-strategy/form.vue'
import FaultMaintainStrategyDetail from '_c/fault-maintain-strategy/detail.vue'
export default {
  name: 'FaultMaintainStrategy',
  components: {
    Confirm,
    FaultMaintainStrategyForm,
    FaultMaintainStrategyDetail
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      selectedIds: [],
      deptShow: false,
      form: {
        grpName: '', // 用户组名称
        fmsName: '', // 策略名称
        deptName: '', // 部门名称
        userName: '', // 维护人
        dispatchflag: '', // 是否自动派单
        fmsStatus: '' // 策略状态
      },
      formData: {
        show: false,
        action: '故障维护策略新增',
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
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'fmsId',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.fmsId
              }
            }, row.fmsId)
          }
        },
        {
          title: '名称',
          key: 'fmsName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.fmsName
              }
            }, row.fmsName)
          }
        },
        {
          title: '维护单位',
          key: 'deptName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.deptName
              }
            }, row.deptName)
          }
        },
        {
          title: '工单处理组',
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
          title: '维护人',
          key: 'userName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.userName
              }
            }, row.userName)
          }
        },
        {
          title: '自动派单',
          key: 'dispatchflag',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.dispatchflag ? '是' : '否'
              }
            }, row.dispatchflag ? '是' : '否')
          }
        },
        {
          title: '状态',
          key: 'fmsStatus',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.fmsStatus ? '启用' : '禁用'
              }
            }, row.fmsStatus ? '启用' : '禁用')
          }
        },
        {
          title: '开始时间',
          key: 'beginTime',
          ellipsis: true,
          align: 'center',
          width: 150,
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
          title: '描述',
          key: 'fmsDesc',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.fmsDesc
              }
            }, row.fmsDesc)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 120,
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
                    this.formData.action = '故障维护策略修改'
                    this.formData.callback = this.update
                    this.formData.type = 2
                    this.formData.info = row
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
                  title: row.delflag ? '删除' : '不可删除'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (!row.delflag) return
                    this.confirm.callback = this.delete
                    this.confirm.action = '删除'
                    this.confirm.operator = row.fmsName
                    this.confirm.id = row.fmsId
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
    this.getFmsList({})
    this.getOrganizationalUnit()
  },
  watch: {
    pageIndex () {
      this.getFmsList({ pageIndex: this.pageIndex })
    }
  },
  computed: {
    ...mapState({
      fmsList: state => state.abnormal.fmsList,
      fmsTotal: state => state.abnormal.fmsTotal,
      showConfirmModal: state => state.app.showConfirmModal,
      unit: state => state.user.organizationalUnit
    }),
    total () {
      if (this.fmsTotal >= this.pageSize && this.fmsTotal.length === 0) this.pageIndex -= 1
      return this.fmsTotal
    },
    tree () {
      const tree = []
      this.unit.forEach(item => {
        tree.push(this.makeTree(item))
      })
      return tree
    }
  },
  methods: {
    ...mapActions([
      'getOrganizationalUnit',
      'getFmsList',
      'addFms',
      'updateFms',
      'deleteFms'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    selectionChange (e) { // 表格选择事件
      this.selectedIds = []
      e.forEach(item => {
        this.selectedIds.push(item.fmsId)
      })
    },
    pageChanged (e) { // 页码变化更新
      this.pageIndex = e
    },
    handleAddBtnClick () {
      this.formData.show = true
      this.formData.action = '故障维护策略新增'
      this.formData.callback = this.add
      this.formData.type = 1
      this.formData.info = {}
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先勾选故障维护策略再进行删除' })
      this.confirm.operator = '所勾选的故障维护策略'
      this.confirm.action = '删除'
      this.confirm.callback = this.batchDelete
      this.confirm.id = ''
      this.setShowConfirmModal(true)
    },
    query () { // 查询按钮点击事件
      this.getFmsList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
    },
    empty () { // 重置按钮点击事件
      this.form = {
        grpName: '', // 用户组名称
        fmsName: '', // 策略名称
        deptName: '', // 部门名称
        userName: '', // 维护人
        dispatchflag: '', // 是否自动派单
        fmsStatus: '' // 策略状态
      }
      this.getFmsList({ pageSize: this.pageSize })
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
      this.addFms(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '故障维护策略新增成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getFmsList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
      })
    },
    update (params) {
      this.updateFms(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '故障维护策略修改成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getFmsList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
      })
    },
    delete (fmsId, isFinal = false) {
      this.deleteFms(fmsId).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '故障维护策略删除成功' })
        this.setShowConfirmModal(false)
        this.getFmsList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
      })
    },
    makeTree (node) { // 子类型节点树
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
      return h('span', {
        class: 'ivu-tree-title',
        on: {
          click: e => {
            this.form.deptName = data.title
            this.deptShow = !this.deptShow
          }
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'md-folder',
              size: 18
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ])
      ])
    }
  }
}
</script>
