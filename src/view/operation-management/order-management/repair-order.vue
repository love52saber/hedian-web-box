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
    <Card class="m_top_content mb20" shadow bordered>
      <Form :label-width="100">
        <Row :gutter="80">
          <i-col :span="8">
            <FormItem class="mb10" label="工单类型：">
              <Select v-model="form.wfType" placeholder='请选择工单类型'>
                <Option :value="''">全部</Option>
                <Option :value="1">维修工单</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="工单标题：">
              <Input v-model="form.wfTitle" placeholder='请输入工单标题' />
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警等级：">
              <Input v-model="form.resAbnormallevelName" placeholder="请输入告警等级"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="创建人：">
              <Input v-model="form.userName" placeholder="请输入创建人"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="创建期限：">
              <DatePicker v-model="time.beginTime" format="yyyy-MM-dd HH:mm:ss" @on-change="timeChanged('beginTime', $event)" type="datetime" style="width:45%" placeholder="请选择开始期限" />
              <span style="display:inline-block;width:10%;text-align:center">一</span>
              <DatePicker v-model="time.endTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width:45%" placeholder="请选择结束期限" />
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="处理人：">
              <Input v-model="form.currentUserName" placeholder="请输入处理人"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="资源名称：">
              <Input v-model="form.resName" placeholder="请输入资源名称"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="工单状态：">
              <Select v-model="form.wfStatus">
                <Option :value="item.value" v-for="item in wfStatusList" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :push="1" :span="8">
            <Button @click.stop="query" class="mr20" type="primary">查询</Button>
            <Button @click.stop="empty" type="default">重置</Button>
          </i-col>
        </Row>
      </Form>
    </Card>

    <Card class="m_bottom_content" shadow bordered>
      <div slot="title">
        <Button class="u_btn u_btn_add mr20" @click.stop="handleAddBtnClick" type="info" size='large'> 创建 </Button>
        <Button class="u_btn" type="error" @click.stop="handleDeleteBtnClick" size='large'> 删除 </Button>
      </div>
      <Table border ref="selection" height="461" @on-selection-change="selectionChange" :columns="columns" :data="orderList" />
      <div class="u_page">
        <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <create-order ref="create" :params='params' @submit="submit" />
    <detail :detail='detail' />
    <workflow ref="workflow" :params='workflow' />
    <pick-person @pickCallback="submitToReview" type="workflow" :show='pickPersonShow' />
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Confirm, PickPerson } from '_c/controls'
import createOrder from '@/components/order/create'
import detail from '@/components/order/detail'
import workflow from '@/components/order/workflow'
import * as orderApi from '@/api/order'
export default {
  name: 'RepairOrder',
  components: {
    Confirm,
    createOrder,
    detail,
    workflow,
    PickPerson
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      pickPersonShow: false,
      selectedIds: [], // 表格勾选的每一项的id集合
      form: {
        wfTitle: '', // 工单标题
        resAbnormallevelName: '', // 告警等级
        userName: '', // 创建人
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        currentUserName: '', // 处理人
        resName: '', // 资源名称
        wfType: '', // 工单类型
        wfStatus: '' // 已完成
        // TODO: 得分字段待加
      },
      time: {
        beginTime: '',
        endTime: ''
      },
      confirm: {
        operator: '',
        action: '删除',
        id: '',
        callback: this.delete
      },
      params: {
        show: false,
        type: 1, // 类型， 1 新增
        title: '创建工单',
        info: {}
      },
      detail: {
        show: false,
        info: {}
      },
      workflow: {
        show: false,
        title: '处理工单',
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
          key: 'businessId',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.businessId
              }
            }, row.businessId)
          }
        },
        {
          title: '工单编号',
          key: 'wfId',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.wfId
              }
            }, row.wfId)
          }
        },
        {
          title: '工单标题',
          key: 'wfTitle',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.wfTitle
              }
            }, row.wfTitle)
          }
        },
        {
          title: '工单类型',
          key: 'wfType',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: '维修工单'
              }
            }, '维修工单')
          }
        },
        {
          title: '资源名称',
          key: 'resName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resBase.resName
              }
            }, row.resBase.resName)
          }
        },
        {
          title: '告警等级',
          key: 'resAbnormallevelName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormallevelName
              }
            }, row.resAbnormallevelName)
          }
        },
        {
          title: '创建人',
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
          title: '创建时间',
          key: 'gmtCreate',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.gmtCreate
              }
            }, row.gmtCreate)
          }
        },
        {
          title: '当前节点',
          key: 'currentStep',
          ellipsis: true,
          sortable: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: !row.wfStatus ? this.flowMap[row.currentStep] : '已完成'
              }
            }, !row.wfStatus ? this.flowMap[row.currentStep] : '已完成')
          }
        },
        {
          title: '处理人',
          key: 'currentUserName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.currentUserName
              }
            }, row.currentUserName)
          }
        },
        {
          title: '期望解决时长',
          key: 'hopetime',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.hopetime + '小时'
              }
            }, row.hopetime + '小时')
          }
        },
        {
          title: '最晚解决时长',
          key: 'endTime',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.deadtime + '小时'
              }
            }, row.deadtime + '小时')
          }
        },
        {
          title: '最终得分',
          key: 'woEvalScore',
          ellipsis: true,
          width: 180,
          align: 'center',
          render: (h, { row }) => {
            if (row.woEvalScore === undefined) {
              return h('span', '—')
            } else {
              return h('Rate', {
                props: {
                  value: 3.2,
                  disabled: true,
                  'allow-half': true
                },
                class: 'rate'
              }, '')
            }
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
                    this.detail.info = row
                    this.detail.show = true
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'md-hand',
                  color: !row.wfStatus ? (this.canHandle(row) ? '#04bbb7' : '#ccc') : '#ccc',
                  size: 20
                },
                attrs: {
                  title: !row.wfStatus ? (this.canHandle(row) ? '处理' : '无权处理') : '已完成'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (row.wfStatus) return
                    if (row.currentStep > 0) {
                      this.workflow.info = row
                      this.workflow.show = true
                    } else {
                      this.$store.commit('setSubmitToReview', {
                        taskId: row.taskId,
                        currentStep: row.currentStep,
                        businessId: row.businessId
                      })
                      this.pickPersonShow = true
                    }
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: window.config.DELETE_ICON,
                  color: row.currentStep === 0 ? '#04bbb7' : '#ccc',
                  size: 20
                },
                attrs: {
                  title: row.currentStep === 0 ? '删除' : '不可删除'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (row.currentStep !== 0) return
                    this.confirm.callback = this.delete
                    this.confirm.action = '删除'
                    this.confirm.operator = row.wfTitle
                    this.confirm.id = row.businessId
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
    this.$store.dispatch('getOrderList', { vue: this, params: {} })
  },
  watch: {
    pageIndex () {
      this.$store.dispatch('getOrderList', { vue: this, params: { pageIndex: this.pageIndex, ...this.form } })
    }
  },
  computed: {
    ...mapState({
      orderList: state => state.order.orderList.list,
      flowMap: state => state.order.flowMap,
      wfStatusList: state => state.order.wfStatusList,
      userId: state => state.user.userId,
      showConfirmModal: state => state.app.showConfirmModal
    }),
    total () {
      const data = this.$store.state.order.orderList
      if (data.total && data.total >= this.pageSize && data.list && !data.list.length) {
        this.pageIndex -= 1
      }
      return data.total ? data.total : 1
    }
  },
  methods: {
    ...mapMutations(['setShowConfirmModal']),
    submitToReview ({ canSubmit }) { // 处在创建节点的工单提交转审核
      this.pickPersonShow = false
      if (!canSubmit) return
      this.$refs.workflow.ok()
    },
    handleAddBtnClick () {
      this.params.info = {}
      // this.$refs.fms.resetForm()
      this.params.title = '创建工单'
      this.params.type = 1
      this.params.show = true
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先选择工单再进行删除' })
      this.confirm.operator = '所勾选的工单记录'
      this.confirm.action = '删除'
      this.confirm.callback = this.batchDelete
      this.confirm.id = ''
      this.setShowConfirmModal(true)
    },
    pageChanged (e) { // 页码变化更新
      this.pageIndex = e
    },
    query () { // 查询按钮点击事件
      if (this.pageIndex !== 1) {
        this.pageIndex = 1
      } else {
        this.$store.dispatch('getOrderList', { ...this.form })
      }
    },
    empty () { // 重置按钮点击事件
      this.form = {
        wfTitle: '', // 工单标题
        resAbnormallevelName: '', // 告警等级
        userName: '', // 创建人
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        currentUserName: '', // 处理人
        wfType: '',
        wfStatus: ''
        // TODO:得分三个字段待加
      }
      this.time = {
        beginTime: '',
        endTime: ''
      }
      this.$store.dispatch('getOrderList', { vue: this, params: {} })
    },
    selectionChange (e) { // 表格选择事件
      this.selectedIds = []
      e.forEach(item => {
        this.selectedIds.push(item.businessId)
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
    delete (id, isFinal = false) {
      orderApi.deleteWf(id).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '工单删除成功' })
        this.setShowConfirmModal(false)
        this.query()
      })
    },
    timeChanged (name, e) { // 时间格式化为yyyy-MM-dd HH:mm:ss
      this.form[name] = e
    },
    canHandle (row) { // 判断当前用户是否可以处理流程
      return row.currentUser === this.userId
    },
    submit (e) { // 操作回调
      switch (e.type) {
        case 1: // 保存
          this.save(e.params)
          break
        case 2: // 新增
          this.add(e.params)
          break
        default:
          break
      }
    },
    save (params) { // 保存事件
      orderApi.saveWorkFlow(params).then(res => {
        if (res.msg !== 'success') return
        this.params.show = false
        this.$refs.create.clear()
        this.$Notice.success({
          title: '保存成功',
          desc: `该工单编号为${res.data}`
        })
        // 更新列表
        this.query()
      })
    },
    add (params) { // 创建工单
      orderApi.startWorkFlow(params).then(res => {
        if (res.msg !== 'success') return
        this.params.show = false
        this.$refs.create.clear()
        this.$Notice.success({
          title: '提交成功',
          desc: `该工单编号为${res.data}`
        })
        // 更新列表
        this.query()
      })
    }
  }
}
</script>

<style>
</style>
