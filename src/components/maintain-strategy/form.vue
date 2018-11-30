<template>
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false" width='1000'>
    <Form class="g_user_group_form mr30" :model='form' :rules="rules" ref="form" :label-width='100'>
      <Row>
        <i-col :span="12">
          <FormItem prop='msName' label='策略标题：'>
            <Input v-model="form.msName" placeholder='输入策略标题' :maxlength="NAME_LENGTH_LIMIT" />
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem prop='msType' label='类型：'>
            <Select v-model="form.msType">
              <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem prop='beginTime' label='开始时间：'>
            <DatePicker type="datetime" v-model="form.beginTime" style="width:100%" placeholder="请选择开始时间" />
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem prop='endTime' label='结束时间：'>
            <DatePicker type="datetime" v-model="form.endTime" style="width:100%" placeholder="请选择结束时间" />
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem label='状态：' prop='msStatus'>
            <RadioGroup v-model="form.msStatus">
              <Radio :label="1">启用</Radio>
              <Radio :label="2">停用</Radio>
            </RadioGroup>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem label='描述：'>
            <Input :placeholder='`输入描述，不超过${DESC_LENGTH_LIMIT}个字`' type="textarea" v-model="form.msDesc" :maxlength="DESC_LENGTH_LIMIT" />
          </FormItem>
        </i-col>
        <i-col :span="24">
          <FormItem label='配置：'>
            <Tabs type="card">
              <TabPane label="资源信息">
                <Button class="mb10 mr10" @click='resourceShow = true' type="info">添加</Button>
                <Button class="mb10" @click='deleteRes' type="error">删除</Button>
                <Table border no-data-text="请添加资源" ref="selection" height="335" @on-selection-change="selectChange" :columns="columns" :data="resource"></Table>
              </TabPane>
            </Tabs>
          </FormItem>
        </i-col>
      </Row>
    </Form>
    <div class="m_footer" slot="footer">
      <Button @click="ok" class="u_btn u_btn_ok" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
    <resource ref="resource" :show="resourceShow" :pattern="1" :is-fixed-main-type="false" @callback="selectResCallback" />
  </Modal>
</template>
<script>
import { Resource } from '_c/controls'
import { mapState } from 'vuex'
import mixin from '@/mixin'
export default {
  name: 'MaintainStrategyForm',
  mixins: [mixin],
  components: {
    Resource
  },
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  watch: {
    formData: {
      handler () {
        if (this.formData.type !== 2) return
        _.forIn(this.form, (val, key) => {
          this.form[key] = _.get(this.formData.info, key, '')
        })
      },
      deep: true
    }
  },
  data () {
    return {
      resourceShow: false,
      selectRes: [],
      form: {
        msName: '',
        msType: '',
        beginTime: '',
        msDesc: '',
        endTime: '',
        msStatus: 1,
        resIds: [],
        msId: ''
      },
      rules: {
        msName: [
          { required: true, message: '策略标题不能为空', trigger: 'blur' }
        ],
        msType: [
          { required: true, type: 'number', message: '请选择类型', trigger: 'change' }
        ],
        beginTime: [
          { required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, type: 'date', message: '请选择结束时间', trigger: 'change' }
        ],
        msStatus: [
          { required: true, type: 'number', message: '请选择状态', trigger: 'change' }
        ]
      },
      columns: [
        {
          title: '选择',
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编码',
          key: 'resSerialnumber',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resSerialnumber
              }
            }, row.resSerialnumber)
          }
        },
        {
          title: '名称',
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
          title: '别名',
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
          title: '主类型',
          key: 'resMainType',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resMainType.resMtypeName
              }
            }, row.resMainType.resMtypeName)
          }
        },
        {
          title: '子类型',
          key: 'resSubtype',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resSubtype.resStypeName
              }
            }, row.resSubtype.resStypeName)
          }
        },
        {
          title: 'IP地址',
          key: 'resIpv4',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resIpv4
              }
            }, row.resIpv4)
          }
        },
        {
          title: '地址信息',
          key: 'resAddress',
          ellipsis: true,
          align: 'center',
          width: 170,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAddress
              }
            }, row.resAddress)
          }
        },
        {
          title: '操作',
          width: 70,
          align: 'center',
          render: (h, { row }) => {
            return h('div', [
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
                    this.form.resIds.splice(this.form.resIds.findIndex(item => item === row.resId), 1)
                    this.$refs.resource.toggleSelect(row)
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
      resList: state => state.device.resList,
      type: state => state.abnormal.maintainType
    }),
    resource () {
      const res = []
      this.resList.forEach(item => {
        if (this.form.resIds.findIndex(i => i === item.resId) > -1) {
          res.push(item)
        }
      })
      return res
    }
  },
  methods: {
    selectChange (e) { // 表格多选事件
      this.selectRes = e
    },
    deleteRes () {
      if (!this.selectRes.length) return this.$Notice.error({ title: '未选择资源' })
      this.selectRes.forEach(item => {
        this.$refs.resource.toggleSelect(item) // 更改资源组件的勾选状态
        this.form.resIds.splice(this.form.resIds.findIndex(r => r === item.resId), 1) // 更新当前页面的表格数据
      })
      this.selectedIds = []
    },
    selectResCallback (data) { // 选择资源组件向新增组件数据传递fun
      this.resourceShow = false
      if (data.handle === 'cancel') return
      this.form.resIds = []
      this.selectRes = []
      data.array.map(item => {
        this.form.resIds.push(item.resId)
      })
    },
    ok () { // 确定点击事件
      if (this.form.beginTime) {
        this.form.beginTime = new Date(this.form.beginTime)
      }
      if (this.form.endTime) {
        this.form.endTime = new Date(this.form.endTime)
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.formData.callback(this.form)
      })
    },
    cancel () { // 取消点击事件
      this.formData.show = false
      this.clear()
    },
    clear () { // 清空表单数据
      this.$refs.form.resetFields()
      setTimeout(() => {
        this.form = {
          msName: '',
          msType: '',
          beginTime: '',
          msDesc: '',
          endTime: '',
          msStatus: 1,
          resIds: [],
          msId: ''
        }
      }, 300)
    }
  }
}
</script>
