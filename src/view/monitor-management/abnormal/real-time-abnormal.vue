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
    <Card class="m_top_content mb10" shadow bordered>
      <Form :label-width="100">
        <Row :gutter="80">
          <i-col :span="8">
            <FormItem class="mb10" label="开始时间：">
              <DatePicker format="yyyy-MM-dd HH:mm:ss" v-model="time.begin" type="datetime" @on-change="timeChanged('beginTime', $event)" style="width:100%" placeholder="请选择开始时间" />
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="结束时间：">
              <DatePicker type="datetime" v-model="time.end" format="yyyy-MM-dd HH:mm:ss" @on-change="timeChanged('endTime', $event)" style="width:100%" placeholder="请选择结束时间" />
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="确认状态：">
              <Select v-model="form.conStatus" placeholder='请选择确认状态'>
                <Option :value="''">全部</Option>
                <Option :value="1">未确认</Option>
                <Option :value="2">已确认</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="级别：">
              <Input v-model="form.abnormalLevel" placeholder="请输入级别"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警类型：">
              <Input v-model="form.abnormalType" placeholder="请输入告警类型"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警名称：">
              <Input v-model="form.abnormalName" placeholder="请输入告警名称"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警对象:">
              <Input v-model="form.resName" placeholder="请输入告警对象名称"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警指标：">
              <Input v-model="form.mokpiName" placeholder="请输入告警指标："></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警对象别名：">
              <Input v-model="form.resAlias" placeholder="请输入告警对象别名"></Input>
            </FormItem>
          </i-col>
          <i-col :push="18" :span="6">
            <Checkbox v-model="form.isAutoOrder">已派单</Checkbox>
            <Button @click.stop="query" class="mr20" type="primary">查询</Button>
            <Button @click.stop="empty" type="default">重置</Button>
          </i-col>
        </Row>
      </Form>
    </Card>
    <Card class="m_bottom_content" shadow bordered>
      <div slot="title">
        <Button class="u_btn u_btn_add mr20" @click.stop='handleConfirmBtnClick' type="success" size='large'> 确认 </Button>
        <Button class="u_btn u_btn_add mr20" @click.stop="handleCleanBtnClick" type="info" size='large'> 清除 </Button>
        <Button class="u_btn" type="error" @click.stop="handleDeleteBtnClick" size='large'> 删除 </Button>
        <div class="fr m_dot_container" v-if="abnormalLevelCount.length>0">
          <Tooltip placement="top-start" :content="item.abnormalLevelName" v-for="(item, index) in abnormalLevelCount" :key="index">
            <Tag type="dot" style="border:none !important;padding:0 5px;" :color="item.abnormalLevelColor">{{item.abnormalLevelCount}}</Tag>
          </Tooltip>
        </div>
      </div>
      <Table border ref="selection" height="461" @on-selection-change="selectionChange" :columns="columns" :data="realTimeAlarmList" />
      <div class="u_page">
        <Page @on-change="pageChanged" :current="pageIndex" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <abnormal-detail :data="detail" />
    <abnormal-form ref="form" :form-data="formData" />
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import AbnormalDetail from '_c/abnormal/detail'
import { Confirm } from '_c/controls'
import AbnormalForm from '_c/abnormal/form'
export default {
  name: 'RealTimeAbnormal',
  components: {
    AbnormalDetail,
    AbnormalForm,
    Confirm
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      selectedIds: [], // 选择的id集合
      form: {
        beginTime: '',
        endTime: '',
        conStatus: '',
        abnormalLevel: '',
        abnormalType: '',
        abnormalName: '',
        mokpiName: '',
        resName: '',
        resAlias: '',
        isAutoOrder: false
      },
      time: { // 临时存储时间选择插件的双向数据绑定，便于清除value，实际数据为form.beginTime,form.endTime
        begin: '',
        end: ''
      },
      detail: {
        show: false,
        info: {}
      },
      confirm: {
        operator: '',
        action: '删除',
        id: '',
        callback: this.delete
      },
      formData: {
        show: false,
        action: '告警确认',
        callback: null,
        type: 1, // 1 确认 0 清除
        info: {} // row信息
      },
      reason: {
        confirmReason: '',
        cleanReason: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'resAbnormalId',
          ellipsis: true,
          width: 80,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormalId
              }
            }, row.resAbnormalId)
          }
        },
        {
          title: '确认状态',
          key: 'confirmStatus',
          ellipsis: true,
          align: 'center',
          width: 90,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.confirmStatus === 1 ? '未确认' : '已确认'
              }
            }, row.confirmStatus === 1 ? '未确认' : '已确认')
          }
        },
        {
          title: '级别',
          key: 'resAbnormallevelName',
          ellipsis: true,
          width: 80,
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
          title: '告警类型',
          key: 'abnormalTypeName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.abnormalTypeName
              }
            }, row.abnormalTypeName)
          }
        },
        {
          title: '告警名称',
          key: 'resAbnormalName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormalName
              }
            }, row.resAbnormalName)
          }
        },
        {
          title: '告警指标',
          key: 'mokpiName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mokpiName
              }
            }, row.mokpiName)
          }
        },
        {
          title: '告警对象',
          key: 'resName',
          ellipsis: true,
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
          title: '告警对象别名',
          key: 'resAlias',
          ellipsis: true,
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
          title: '发生时间',
          key: 'beginTime',
          ellipsis: true,
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnomaltime
              }
            }, row.resAbnomaltime)
          }
        },
        // TODO: 关联工单暂时没有，空着先
        {
          title: '关联工单',
          key: 'dispatchTicketId',
          ellipsis: true,
          align: 'center',
          width: 100,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: ''
              }
            }, '')
          }
        },
        {
          title: '详细信息',
          key: 'resAbnormaldesc',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormaldesc
              }
            }, row.resAbnormaldesc)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 180,
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: window.config.DETAIL_ICON,
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '详细信息'
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
                  type: 'md-checkmark-circle-outline',
                  color: row.confirmStatus === 1 ? '#04bbb7' : '#bbb7b7',
                  size: 20
                },
                attrs: {
                  title: '确认'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (row.confirmStatus === 2) return
                    this.formData.action = '告警确认'
                    this.formData.callback = this.confirmCallback
                    this.formData.info = row
                    this.formData.show = true
                  }
                }
              }),
              // TODO:派单功能暂时没有，空着先
              h('Icon', {
                props: {
                  type: 'md-redo',
                  // color: row.dispatchType === 0 ? '#04bbb7' : '#bbb7b7',
                  color: '#ccc',
                  size: 20
                },
                attrs: {
                  title: '派单'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (row.dispatchType) return ''
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'md-log-out',
                  color: row.cleanType === 0 ? '#04bbb7' : '#bbb7b7',
                  size: 20
                },
                attrs: {
                  title: '清除'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (row.cleanType) return
                    this.formData.action = '告警清除'
                    this.formData.callback = this.cleanCallback
                    this.formData.info = row
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
                    this.confirm.callback = this.delete
                    this.confirm.action = '删除'
                    this.confirm.operator = `序号为${row.resAbnormalId}的告警记录`
                    this.confirm.id = row.resAbnormalId
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
      realTimeAlarmList: state => state.abnormal.realTimeAlarmList,
      abnormalTotal: state => state.abnormal.realTimeAbnormalTotal,
      abnormalLevelCount: state => state.abnormal.abnormalLevelCount,
      showConfirmModal: state => state.app.showConfirmModal
    }),
    total () {
      if (this.abnormalTotal >= this.pageSize && this.realTimeAlarmList.length === 0) this.pageIndex -= 1
      return this.abnormalTotal
    }
  },
  watch: {
    pageIndex () {
      this.getRealTimeAbnormal({ pageIndex: this.pageIndex, ...this.form })
    }
  },
  created () {
    this.getRealTimeAbnormal({})
    this.getAbnormalLevelCount()
  },
  methods: {
    ...mapActions([
      'getRealTimeAbnormal',
      'getAbnormalLevelCount',
      'confirmAbnormal',
      'cleanAbnormal',
      'deleteAbnormal'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    selectionChange (e) { // 表格选择事件
      this.selectedIds = []
      e.forEach(item => {
        this.selectedIds.push(item.resAbnormalId)
      })
    },
    pageChanged (e) { // 页码变化更新
      this.pageIndex = e
    },
    timeChanged (name, e) { // 时间格式化为yyyy-MM-dd HH:mm:ss
      this.form[name] = e
    },
    query () { // 查询按钮点击事件
      this.getRealTimeAbnormal({ pageIndex: this.pageIndex, ...this.form })
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先选择告警记录再进行删除' })
      this.confirm.operator = '所勾选的告警记录'
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
    delete (id, isFinal = false) {
      this.deleteAbnormal(id).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '告警删除成功' })
        this.setShowConfirmModal(false)
        this.getRealTimeAbnormal({ pageIndex: this.pageIndex })
        this.getAbnormalLevelCount()
      })
    },
    empty () { // 重置按钮点击事件
      this.form = {
        beginTime: '',
        endTime: '',
        conStatus: '',
        abnormalLevel: '',
        abnormalType: '',
        abnormalName: '',
        mokpiName: '',
        resName: '',
        resAlias: '',
        isAutoOrder: false
      }
      this.time = {
        begin: '',
        end: ''
      }
      this.getRealTimeAbnormal({ pageIndex: 1, ...this.form })
    },
    handleConfirmBtnClick () { // 确认按钮点击
      if (!this.selectedIds.length) return this.$Notice.warning({ title: '请先勾选要确认的告警信息！' })
      const canBeCleand = this.selectedIds.some(item => this.realTimeAlarmList.find(abnormal => abnormal.resAbnormalId === item).confirmStatus === 1) // 如果勾选的全部是已确认的状态
      if (!canBeCleand) return this.$Notice.warning({ title: '请勾选未被确认的告警信息！' })
      const _this = this // modal实例中this指向会变化
      this.$Modal.confirm({
        title: '确认告警',
        loading: true,
        render: (h) => {
          return h('Form',
            {
              ref: 'confirmreason',
              props: {
                model: this.reason
              }
            }, [
              h('FormItem', {
                props: {
                  label: '确认意见:',
                  required: true,
                  rules: { required: true, message: '确认意见不能为空', trigger: 'blur' },
                  prop: 'confirmReason'
                }
              }, [h('Input', { props: { type: 'textarea', rows: 3, placeholder: '请填写批量确认意见,若所勾选的记录是已被确认状态则不做任何处理', maxlength: 200 }, on: { input: (e) => { this.reason.confirmReason = e } } })])
            ])
        },
        onOk: function () {
          this.$refs['confirmreason'].validate((valid) => {
            this.buttonLoading = false
            if (valid) {
              const abList = _this.realTimeAlarmList
              _this.selectedIds.forEach((item, index, arr) => {
                const idx = abList.findIndex(ab => ab.resAbnormalId === item)
                if (abList[idx].confirmStatus === 1) { // 未确认的选项进行确认操作，已确认的不做处理
                  _this.confirmCallback({ resAbnormalId: abList[idx].resAbnormalId, value: _this.reason.confirmReason }, index === (_this.selectedIds.length - 1))
                }
                if (index === _this.selectedIds.length - 1) {
                  _this.selectedIds = []
                  _this.reason.confirmReason = ''
                  this.$Modal.remove()
                }
              })
            }
          })
        }
      })
    },
    handleCleanBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.warning({ title: '请先勾选要清除的告警信息！' })
      const canBeCleand = this.selectedIds.some(item => this.realTimeAlarmList.find(abnormal => abnormal.resAbnormalId === item).cleanType === 0) // 如果勾选的全部是已被清除的状态
      if (!canBeCleand) return this.$Notice.warning({ title: '请勾选未被清除的告警信息！' })
      const _this = this
      this.$Modal.confirm({
        title: '清除告警',
        loading: true,
        render: (h) => {
          return h('Form',
            {
              ref: 'cleanreason',
              props: {
                model: this.reason
              }
            },
            [
              h('FormItem', {
                props: {
                  label: '清除意见:',
                  required: true,
                  rules: { required: true, message: '清除意见不能为空', trigger: 'blur' },
                  prop: 'cleanReason'
                }
              }, [h('Input', { props: { type: 'textarea', rows: 3, placeholder: '请填写批量清除意见，若所勾选的记录是已被清除状态则不做任何处理', maxlength: 200 }, on: { input: (e) => { this.reason.cleanReason = e } } })])
            ])
        },
        onOk: function () {
          this.$refs['cleanreason'].validate((valid) => {
            this.buttonLoading = false
            if (valid) {
              const abList = _this.realTimeAlarmList
              _this.selectedIds.forEach((item, index, arr) => {
                const idx = abList.findIndex(ab => ab.resAbnormalId === item)
                if (abList[idx].cleanType === 0) { // 未清除的选项进行清除操作，已经清除的不做处理
                  _this.cleanCallback({ resAbnormalId: abList[idx].resAbnormalId, value: _this.reason.confirmReason }, index === (_this.selectedIds.length - 1))
                }
                if (index === _this.selectedIds.length - 1) {
                  _this.selectedIds = []
                  _this.reason.cleanReason = ''
                  this.$Modal.remove()
                }
              })
            }
          })
        }
      })
    },
    confirmCallback (params, isFinal = false) {
      const { resAbnormalId, value } = params
      this.confirmAbnormal({ resAbnormalId, confirmInfo: value }).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '故障确认成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getRealTimeAbnormal({ pageIndex: this.pageIndex, ...this.form })
        this.getAbnormalLevelCount()
      })
    },
    cleanCallback (params, isFinal = false) {
      const { resAbnormalId, value } = params
      this.cleanAbnormal({ resAbnormalId, cleanInfo: value }).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '故障清除成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getRealTimeAbnormal({ pageIndex: this.pageIndex, ...this.form })
        this.getAbnormalLevelCount()
      })
    }
  }
}
</script>
