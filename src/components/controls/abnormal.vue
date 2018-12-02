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
      <Row>
        <Col span="7">
        <Input v-model="form.resAbnormalId" placeholder="输入告警序号">
        <span slot="prepend">告警序号</span>
        </Input>
        </Col>
        <Col span="1">&nbsp;</Col>
        <Col span="7">
        <Input v-model="form.abnormalName" placeholder="输入名称">
        <span slot="prepend">告警名称</span>
        </Input>
        </Col>
        <Col span="1">&nbsp;</Col>
        <Col span="7">
        <Select placeholder='请选择级别' v-model="form.abnormalLevel">
          <Option :value="''">全部</Option>
          <Option v-for="item in level" :value="item.resAbnormallevelName" :key="item.resAbnormallevelId">{{ item.resAbnormallevelName }}</Option>
        </Select>
        </Col>
        <div class="ivu-col ivu-col-span-24" style="height:10px"></div>
        <Col span='7'>
        <Input v-model="form.abnormalType" placeholder="输入故障类型">
        <span slot="prepend">故障类型</span>
        </Input>
        </Col>
        <Col span="1">&nbsp;</Col>
        <Col span='7'>
        <Input v-model="form.mokpiName" placeholder="输入告警对象">
        <span slot="prepend">告警对象</span>
        </Input>
        </Col>
        <Col span="1">&nbsp;</Col>
        <Col span='7'>
        <Input v-model="form.resName" placeholder="输入告警设备">
        <span slot="prepend">告警设备</span>
        </Input>
        </Col>
        <Col span="5" style="float:right;margin-top:10px">
        <Button style="background:#04bbb7;margin-right:20px" @click='query' type="info">查询</Button>
        <Button type="default" @click="empty">重置</Button>
        </Col>
      </Row>
      <div class="m_table_container">
        <Table disabled-hover border ref="selection" @on-selection-change='selectChange' height="290" :columns="patternRender" :data="abnormalControl"></Table>
      </div>
    </Form>
    <div slot="footer" style="text-align:center;">
      <Button @click="ok" style="background:#04bbb7;width:100px;" type="info" size="large">确定</Button>
      <Button @click="cancel" style="width:100px" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState } from 'vuex'
import bus from '@/libs/bus'
export default {
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
    this.$store.dispatch('getRealTimeAbnormal', { pageIndex: 1, pageSize: 99999 })
    this.$store.dispatch('getAbnormalLevel')
    this.$store.dispatch('getAbnormalType')
  },
  mounted () {
    bus.$on('resIdChanged', (id) => {
      this.$store.dispatch('getRealTimeAbnormal', { pageIndex: 1, resId: id, pageSize: 99999 })
    })
    // 监控id参数，筛选出对应数据默认勾选（目前只是单选模式）
    this.$watch('id', () => {
      if (!this.id) return
      let list = this.$store.state.statistics.abnormalControl
      list.forEach(item => {
        item.selected = false
      })
      const index = list.findIndex(item => item.moAbnormalId === this.id)
      if (index > -1) {
        list[index].selected = true
      }
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
                this.$store.state.statistics.abnormalControl.map(x => {
                  x.selected = false
                })
                this.$store.state.statistics.abnormalControl[params.index].selected = val
                this.selectRes = [this.$store.state.statistics.abnormalControl[params.index]]
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
    selectChange (e) { // 多选表格的change事件
      this.selectRes = e
    },
    query () { // 查询按钮点击事件
      this.$store.dispatch('abnormalControl', { params: { pageIndex: 1, pageSize: 99999, ...this.form }, vue: this })
    },
    toggleSelect (data) { // 多选模式下切换行数据的勾选状态
      this.$refs.selection.toggleSelect(this.$store.state.statistics.abnormalControl.findIndex(item => item.resAbnormalId === data.resAbnormalId)) // 更改选择资源的状态勾选状态
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
      this.$store.dispatch('abnormalControl', { params: { pageIndex: 1, pageSize: 99999 }, vue: this })
    },
    ok () { // 点击确定将所选数据传给父组件
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
