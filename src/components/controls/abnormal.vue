<style lang='less'>
.m_table_container {
  margin: 15px 0;
  min-height: 180px;
  max-height: 300px;
  overflow: auto;
  .fixHeight {
    height: 36px;
  }
}
</style>
<template>
  <Modal :z-index='1002' v-model="show" title='选择告警' :closable="false" :mask-closable="false" width='1100'>
    <Form>
      <Row :gutter="32">
        <i-col class="mb10" span="8">
          <Input v-model="form.resAbnormalId" placeholder="输入告警序号">
          <span slot="prepend">告警序号</span>
          </Input>
        </i-col>
        <i-col class="mb10" span="8">
          <Input v-model="form.abnormalName" placeholder="输入名称">
          <span slot="prepend">告警名称</span>
          </Input>
        </i-col>
        <i-col class="mb10" span="8">
          <Select placeholder='请选择级别' v-model="form.abnormalLevel">
            <Option :value="''">全部</Option>
            <Option v-for="item in level" :value="item.resAbnormallevelName" :key="item.resAbnormallevelId">{{ item.resAbnormallevelName }}</Option>
          </Select>
        </i-col>
        <i-col class="mb10" span='8'>
          <Input v-model="form.abnormalType" placeholder="输入故障类型">
          <span slot="prepend">故障类型</span>
          </Input>
        </i-col>
        <i-col class="mb10" span='8'>
          <Input v-model="form.mokpiName" placeholder="输入告警对象">
          <span slot="prepend">告警对象</span>
          </Input>
        </i-col>
        <i-col class="mb10" span='8'>
          <Input v-model="form.resName" placeholder="输入告警设备">
          <span slot="prepend">告警设备</span>
          </Input>
        </i-col>
        <i-col :push="16" span="5">
          <Button @click.stop='query' class="mr10" type="info">查询</Button>
          <Button type="default" @click="empty">重置</Button>
        </i-col>
      </Row>
      <div class="m_table_container">
        <Table disabled-hover border ref="selection" @on-selection-change='selectChange' height="290" :columns="patternRender" :data="abnormalControl"></Table>
      </div>
    </Form>
    <div slot="footer" class="m_footer">
      <Button @click="ok" class="u_btn u_btn_ok" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import bus from '@/libs/bus'
export default {
  name: 'Abnormal',
  props: {
    show: Boolean,
    pattern: { // 模式参数， 1为多选模式，0为单选模式
      type: Number,
      default: 1
    },
    id: {
      default: ''
    }
  },
  created () {
    this.getAbnormalType()
    this.getAbnormalLevel()
    this.getRealTimeAbnormal({ pageIndex: 1, pageSize: 99999 })
  },
  watch: {
    id () {
      if (!this.id) return
      let list = this.abnormalControl
      list.forEach(item => {
        item.selected = false
      })
      const index = list.findIndex(item => item.moAbnormalId === this.id)
      if (index === -1) return
      list[index].selected = true
    }
  },
  mounted () {
    bus.$on('resIdChanged', (id) => {
      this.getRealTimeAbnormal({ pageIndex: 1, pageSize: 99999, resId: id })
    })
  },
  computed: {
    patternRender () { // 根据父组件传值进来的pattern渲染单选还是多选模式 1为多选 0为单选
      (this.columns[0].isSingle) ? this.columns.splice(0, 1) : console.log(this.columns)
      this.pattern ? this.columns.unshift(this.pattern1) : this.columns.unshift(this.pattern0)
      return this.columns
    },
    ...mapState({
      abnormalControl: state => state.abnormal.realTimeAlarmList,
      level: state => state.statistics.abnormalLevel,
      type: state => state.statistics.abnormalType
    })
  },
  data () {
    return {
      form: {
        resAbnormalId: '', // 序号
        abnormalLevel: '', // 级别
        abnormalName: '', // 告警名称
        abnormalType: '', // 告警类型
        mokpiName: '', // 告警对象
        resName: '' // 告警设备
      },
      selectRes: [],
      pattern1: {
        title: '选择',
        type: 'selection',
        isSingle: 'isSingle',
        width: 75,
        align: 'center',
        className: 'fixHeight'
      },
      pattern0: {
        title: '选择',
        width: 75,
        align: 'center',
        className: 'fixHeight',
        isSingle: 'isSingle',
        render: (h, params) => {
          return h('Radio', {
            props: {
              value: params.row.selected
            },
            on: {
              'on-change': (val) => {
                this.abnormalControl.map(x => {
                  x.selected = false
                })
                this.abnormalControl[params.index].selected = val
                this.selectRes = [this.abnormalControl[params.index]]
              }
            }
          })
        }
      },
      columns: [
        {
          title: '序号',
          key: 'resAbnormalId',
          ellipsis: true,
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
          title: '告警设备',
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
          title: '设备别名',
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
          title: '级别',
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
          title: '告警对象',
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
        {
          title: '描述',
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
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'getRealTimeAbnormal',
      'getAbnormalLevel',
      'getAbnormalType'
    ]),
    selectChange (e) { // 多选表格的change事件
      this.selectRes = e
    },
    query () { // 查询按钮点击事件
      this.getRealTimeAbnormal({ pageIndex: 1, pageSize: 99999, ...this.form })
    },
    toggleSelect (data) { // 多选模式下切换行数据的勾选状态
      this.$refs.selection.toggleSelect(this.abnormalControl.findIndex(item => item.resAbnormalId === data.resAbnormalId)) // 更改选择资源的状态勾选状态
    },
    empty () { // 清空事件
      this.form = {
        resAbnormalId: '', // 序号
        abnormalLevel: '', // 级别
        abnormalName: '', // 告警名称
        abnormalType: '', // 告警类型
        mokpiName: '', // 告警对象
        resName: '' // 告警设备
      }
      this.getRealTimeAbnormal({ pageIndex: 1, pageSize: 99999 })
    },
    ok () { // 点击确定将所选数据传给父组件
      if (this.selectRes.length === 0) return this.$Notice.warning({ title: '未选择告警' })
      this.$emit('callback', {
        handle: 'ok',
        target: 'abnormal',
        array: this.selectRes
      })
    },
    cancel () { // 点击取消关闭弹窗
      this.$emit('callback', {
        handle: 'cancel',
        target: 'abnormal'
      })
    }
  }
}
</script>
