<style lang="less">
.m_tree_box {
  border: 1px #ccc solid;
  position: absolute;
  z-index: 999;
  width: 100%;
  background: #fff;
  overflow: auto;
}
</style>

<template>
  <Modal :z-index="1002" v-model="show" title='选择故障定义' :closable="false" :mask-closable="false" width='900'>
    <Row :gutter="32" justify="center">
      <i-col class="mb10" :span="8">
        <Input v-model="form.abnormalCode" placeholder="输入故障编码">
        <span slot="prepend">故障编码</span>
        </Input>
      </i-col>
      <i-col class="mb10" :span="8">
        <Input v-model="form.abnormalName" placeholder="输入名称">
        <span slot="prepend">名称</span>
        </Input>
      </i-col>
      <i-col class="mb10" :span="8">
        <Select placeholder='选择级别' v-model="form.abnormalLevel">
          <Option v-for="item in level" :value="item.resAbnormallevelName" :key="item.resAbnormallevelId">{{ item.resAbnormallevelName }}</Option>
        </Select>
      </i-col>
      <i-col class="mb10" :span="8">
        <Select placeholder='选择类型' v-model="form.abnormalType">
          <Option v-for="item in type" :value="item.abnormalTypeName" :key="item.abnormalTypeId">{{ item.abnormalTypeName }}</Option>
        </Select>
      </i-col>
      <i-col class="mb10" :push="8" :span="8">
        <Button @click.stop="empty" class="fr">重置</Button>
        <Button @click.stop="query" class="fr mr10" type="info">查询</Button>
      </i-col>
    </Row>
    <Table class="mr10 ml10 mt10" border ref="selection" @on-selection-change='selectChange' height="335" :columns="patternRender" :data="faultDefinition"></Table>
    <div slot="footer" class="m_footer">
      <Button @click="ok" class="u_btn u_btn_ok" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Fault',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pattern: { // 模式参数， 1为多选模式，0为单选模式
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      selectRes: [],
      form: {
        abnormalCode: '',
        abnormalName: '',
        abnormalType: '',
        abnormalLevel: ''
      },
      pattern1: {
        title: '选择',
        type: 'selection',
        isSingle: 'isSingle',
        width: 75,
        align: 'center'
      },
      pattern0: {
        title: '选择',
        width: 75,
        align: 'center',
        isSingle: 'isSingle',
        render: (h, params) => {
          return h('Radio', {
            props: {
              value: params.row.selected
            },
            on: {
              'on-change': (val) => {
                this.faultDefinition.map(x => {
                  x.selected = false
                })
                this.faultDefinition[params.index].selected = val
                this.selectRes = [this.faultDefinition[params.index]]
              }
            }
          })
        }
      },
      columns: [
        {
          title: '故障编码',
          key: 'moAbnormalcode',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moAbnormalcode
              }
            }, row.moAbnormalcode)
          }
        },
        {
          title: '名称',
          key: 'moAbnormalName',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moAbnormalName
              }
            }, row.moAbnormalName)
          }
        },
        {
          title: '故障类型',
          key: 'abnormalType',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.abnormalType.abnormalTypeName
              }
            }, row.abnormalType.abnormalTypeName)
          }
        },
        {
          title: '级别',
          key: 'resAbnormallevel',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormallevel.resAbnormallevelName
              }
            }, row.resAbnormallevel.resAbnormallevelName)
          }
        }
      ]
    }
  },
  created () {
    this.getFaultDefinition({})
    this.getAbnormalType()
    this.getAbnormalLevel()
  },
  computed: {
    ...mapState({
      faultDefinition: state => state.statistics.faultDefinition,
      level: state => state.statistics.abnormalLevel,
      type: state => state.statistics.abnormalType
    }),
    patternRender () { // 根据父组件传值进来的pattern渲染单选还是多选模式 1为多选 0为单选
      (this.columns[0].isSingle) ? this.columns.splice(0, 1) : console.log(this.columns)
      this.pattern ? this.columns.unshift(this.pattern1) : this.columns.unshift(this.pattern0)
      return this.columns
    }
  },
  methods: {
    ...mapActions([
      'getFaultDefinition',
      'getAbnormalType',
      'getAbnormalLevel'
    ]),
    selectChange (e) {
      this.selectRes = e
    },
    ok () {
      if (this.selectRes.length === 0) return this.$Notice.warning({ title: '请选择故障定义' })
      this.$emit('callback', {
        handle: 'ok',
        array: this.selectRes
      })
    },
    cancel () {
      this.$emit('callback', {
        handle: 'cancel'
      })
    },
    query () { // 查询按钮点击事件
      this.getFaultDefinition(this.form)
    },
    empty () {
      this.form = {
        abnormalCode: '',
        abnormalName: '',
        abnormalType: '',
        abnormalLevel: ''
      }
      this.getFaultDefinition({})
    },
    toggleSelect (row) { // 更改选择资源的状态勾选状态
      this.$refs.selection.toggleSelect(this.resList.findIndex(item => item.resId === row.resId))
    }
  }
}
</script>
