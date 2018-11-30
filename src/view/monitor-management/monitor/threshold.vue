<style lang="less">
.g_TB_container {
  // border: 1px red solid;
  padding: 15px;
  .m_bottom_content {
    height: 100%;
  }
}
.fault_container {
  clear: both;
  margin-top: 20px;
  margin-bottom: 20px;
  .falut_item {
    float: left;
    width: 50%;
    margin-bottom: 10px;
    .fault_key,
    .fault_value {
      float: left;
      width: 30%;
    }
    .fault_value {
      width: 70%;
      font-weight: 800;
    }
  }
}
</style>

<template>
  <div class="g_TB_container">
    <Card class="m_top_content mb10" shadow bordered>
      <Form :label-width="100">
        <Row :gutter="80">
          <i-col :span="8">
            <FormItem label="资源主类型：">
              <Select v-model="form.resMtype">
                <Option v-for="(item, index) in mainTypeList" :key="index" :value="item.resMtypeId">{{item.resMtypeName}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem label="资源子类型：">
              <Input v-model="subTypeName" readonly @on-click='subTypeShow = !subTypeShow' @on-focus='subTypeShow=true' placeholder='请先选择主类型，再选择子类型' :icon="subTypeShow ? 'ios-arrow-up' : 'ios-arrow-down'" />
              <div v-show="subTypeShow" style="border:1px #ccc solid;position:absolute;z-index:999;width:100%;background:#fff;overflow:auto">
                <Tree class='m_tree' :data='tree'></Tree>
              </div>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem label="指标名称：">
              <Input v-model="form.moKpiName" placeholder="输入指标名称"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem label="告警名称：">
              <Input v-model="form.moAbnormalName" placeholder="输入告警名称"></Input>
            </FormItem>
          </i-col>
          <i-col :push="10" :span="6">
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
      <Table border ref="selection" height="503" @on-selection-change="selectionChange" :columns="columns" :data="thresholdList" />
      <div class="u_page">
        <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
    <threshold-form ref="form" :form-data="formData" />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { Confirm } from '_c/controls'
import ThresholdForm from '_c/threshold/form'
export default {
  name: 'Threshold',
  components: {
    Confirm,
    ThresholdForm
  },
  data () {
    return {
      subTypeShow: false,
      subTypeName: '',
      pageIndex: 1,
      pageSize: 11,
      selectedIds: [],
      form: {
        moKpiName: '', // 指标名称
        moAbnormalName: '', // 告警名称
        resMtypeName: '', // 资源主类型名称
        resStypeName: '', // 资源子类型名称
        resMtype: '', // 主类型id，用于查询子类型节点树
        resStype: '', // 资源子类型id，用于查询监控指标
        skId: '' // 监控对象id
      },
      confirm: {
        operator: '',
        action: '',
        id: '',
        callback: this.delete
      },
      formData: {
        show: false,
        action: '阈值规则新增',
        callback: null,
        type: 1, // 1新增 2修改
        info: {}
      },
      thresholdType: {
        '1': '上下限',
        '2': '区间',
        '3': '基准值上下限',
        '4': '基准值区间',
        '5': '等值'
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'moThId',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moThId
              }
            }, row.moThId)
          }
        },
        {
          title: '资源主类型',
          key: 'resMtypeName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resMtypeName
              }
            }, row.resMtypeName)
          }
        },
        {
          title: '资源子类型',
          key: 'resStypeName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resStypeName
              }
            }, row.resStypeName)
          }
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
          title: '类型',
          key: 'moThType',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: this.thresholdType[row.moThType]
              }
            }, this.thresholdType[row.moThType])
          }
        },
        {
          title: '上限值',
          key: 'moThUp',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moThUp ? row.moThUp : '—'
              }
            }, row.moThUp ? row.moThUp : '—')
          }
        },
        {
          title: '下限值',
          key: 'moThDown',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moThDown ? row.moThDown : '—'
              }
            }, row.moThDown ? row.moThDown : '—')
          }
        },
        {
          title: '包含边界值',
          key: 'moThInupdown',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moThInupdown ? '是' : '否'
              }
            }, row.moThInupdown ? '是' : '否')
          }
        },
        {
          title: '对比值',
          key: 'moThValue',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moThValue ? row.moThValue : '—'
              }
            }, row.moThValue ? row.moThValue : '—')
          }
        },
        {
          title: '优先级',
          key: 'moThPriority',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moThPriority
              }
            }, row.moThPriority)
          }
        },
        {
          title: '告警名称',
          key: 'moAbnormalName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moAbnormalName
              },
              style: {
                color: 'blue',
                textDecoration: 'underline',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  const abId = row.moAbnormalId
                  const list = this.$store.state.statistics.faultDefinition
                  const index = list.findIndex(item => item.moAbnormalId === abId)
                  const faultData = list[index]
                  this.$Modal.info({
                    title: '告警信息',
                    width: 600,
                    render: (h) => {
                      return <div class='fault_container'>
                        <div class='falut_item'>
                          <div class='fault_key'>故障编码：</div>
                          <div class='fault_value'>{faultData.moAbnormalcode}</div>
                        </div>
                        <div class='falut_item'>
                          <div class='fault_key'>名称：</div>
                          <div class='fault_value'>{faultData.moAbnormalName}</div>
                        </div>
                        <div class='falut_item'>
                          <div class='fault_key'>故障类型：</div>
                          <div class='fault_value'>{faultData.abnormalType.abnormalTypeName}</div>
                        </div>
                        <div class='falut_item'>
                          <div class='fault_key'>级别：</div>
                          <div class='fault_value'>{faultData.resAbnormallevel.resAbnormallevelName}</div>
                        </div>
                      </div>
                    }
                  })
                }
              }
            }, row.moAbnormalName)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          render: (h, { row }) => {
            return h('div', [
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
                    this.formData.action = '阈值规则修改'
                    this.formData.info = row
                    this.formData.type = 2
                    this.formData.callback = this.update
                    this.formData.show = true
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: window.config.DELETE_ICON,
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
                    if (row.resCurStypeName) return
                    this.confirm.callback = this.delete
                    this.confirm.action = '删除'
                    this.confirm.operator = `序号为${row.moThId}的记录`
                    this.confirm.id = row.moThId
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
      thresholdList: state => state.device.thresholdList,
      thresholdTotal: state => state.device.thresholdTotal,
      mainTypeList: state => state.device.mainTypeList,
      subTypeList: state => state.device.subTypeList
    }),
    total () {
      if (this.thresholdTotal >= this.pageSize && this.thresholdTotal.length === 0) this.pageIndex -= 1
      return this.thresholdTotal
    },
    tree () {
      let tree = []
      if (this.subTypeList && this.subTypeList.length) {
        this.subTypeList.forEach(item => {
          tree.push(this.makeTree(item))
        })
      }
      return tree
    }
  },
  watch: {
    pageIndex () {
      this.getThresholdList({ pageIndex: this.pageIndex, pageSize: this.pageSize })
    },
    'form.resMtype' (current, prev) {
      const data = this.mainTypeList.find(item => item.resMtypeId === current)
      this.form.resMtypeName = data.resMtypeName
      this.getSubTypeList(current)
      this.subTypeName = ''
    },
    'subTypeName' () {
      if (!this.subTypeName) return
      this.form.resStypeName = this.subTypeName
    }
  },
  created () {
    this.getMainTypeList()
    this.getThresholdList({ pageSize: this.pageSize })
  },
  methods: {
    ...mapMutations(['setShowConfirmModal']),
    ...mapActions([
      'getMainTypeList',
      'getThresholdList',
      'getSubTypeList',
      'addThreshold',
      'updateThreshold',
      'deleteThreshold'
    ]),
    pageChanged (e) { // 页码变化更新
      this.pageIndex = e
    },
    selectionChange (e) { // 表格选择事件
      this.selectedIds = []
      e.forEach(item => {
        this.selectedIds.push(item.moThId)
      })
    },
    handleAddBtnClick () {
      this.formData.show = true
      this.formData.action = '阈值规则新增'
      this.formData.callback = this.add
      this.formData.type = 1
      this.formData.info = {}
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先勾选阈值规则再进行删除' })
      this.confirm.operator = '所勾选的阈值规则'
      this.confirm.action = '删除'
      this.confirm.callback = this.batchDelete
      this.confirm.id = ''
      this.setShowConfirmModal(true)
    },
    query () { // 查询按钮点击事件
      this.getThresholdList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
    },
    empty () { // 重置按钮点击事件
      this.form = {
        moKpiName: '', // 指标名称
        moAbnormalName: '', // 告警名称
        resMtypeName: '', // 资源主类型名称
        resStypeName: '', // 资源子类型名称
        resMtype: '', // 主类型id，用于查询子类型节点树
        resStype: '', // 资源子类型id，用于查询监控指标
        skId: '' // 监控对象id
      }
      this.getThresholdList({ pageSize: this.pageSize })
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
      this.addThreshold(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '阈值规则新增成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getThresholdList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
      })
    },
    update (params) {
      this.updateThreshold(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '阈值规则修改成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getThresholdList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
      })
    },
    delete (skId, isFinal = false) {
      this.deleteThreshold(skId).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '阈值规则删除成功' })
        this.setShowConfirmModal(false)
        this.getThresholdList({ ...this.form, pageIndex: this.pageIndex, pageSize: this.pageSize })
      })
    },
    makeTree (node) { // 子类型节点树
      let n = {
        id: node.resStypeId,
        title: node.resStypeName,
        expand: true,
        render: this.renderDepartmentNode,
        children: []
      }
      if (node.children) {
        node.children.forEach(e => {
          n.children.push(this.makeTree(e))
        })
      }
      return n
    },
    renderDepartmentNode (h, { root, node, data }) {
      return h('span', {
        class: 'ivu-tree-title',
        on: {
          click: e => {
            this.resStype = data.id
            this.subTypeName = data.title
            this.subTypeShow = !this.subTypeShow
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
        h('span', data.title)]
      )]
      )
    }
  }
}
</script>
