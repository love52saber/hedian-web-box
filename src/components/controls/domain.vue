<template>
  <Modal :z-index="1002" v-model="show" title='选择管理域' :closable="false" :mask-closable="false" width='800'>
    <Row :gutter="32" justify="center">
      <i-col :push="12" :span="12">
        <Input @on-search="search" search enter-button="搜索" placeholder="输入管理域名称进行搜索，可以使用回车键" />
      </i-col>
    </Row>
    <Table class="mr10 ml10 mt10" border ref="selection" @on-selection-change='selectChange' height="335" :columns="patternRender" :data="mdList"></Table>
    <div slot="footer" class="m_footer">
      <Button @click="ok" class="u_btn u_btn_ok" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Domain',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pattern: { // 模式参数， 1为多选模式，0为单选模式
      type: Number,
      default: 1
    },
    defaultCheckedId: {
      default: ''
    }
  },
  data () {
    return {
      selectRes: [],
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
                this.mdList.map(x => {
                  x.selected = false
                })
                this.mdList[params.index].selected = val
                this.selectRes = [this.mdList[params.index]]
              }
            }
          })
        }
      },
      columns: [
        {
          title: '序号',
          key: 'mdId',
          ellipsis: true,
          align: 'center',
          width: 100,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdId
              }
            }, row.mdId)
          }
        },
        {
          title: '名称',
          key: 'mdName',
          ellipsis: true,
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdName
              }
            }, row.mdName)
          }
        },
        {
          title: '描述',
          key: 'mdDesc',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdDesc
              }
            }, row.mdDesc)
          }
        }
      ]
    }
  },
  created () {
    this.getMaintainDomainInControls({})
  },
  computed: {
    ...mapState({
      mdList: state => state.device.maintainDomainInControls
    }),
    patternRender () { // 根据父组件传值进来的pattern渲染单选还是多选模式 1为多选 0为单选
      (this.columns[0].isSingle) ? this.columns.splice(0, 1) : console.log(this.columns)
      this.pattern ? this.columns.unshift(this.pattern1) : this.columns.unshift(this.pattern0)
      return this.columns
    }
  },
  methods: {
    ...mapActions([
      'getMaintainDomainInControls'
    ]),
    selectChange (e) {
      this.selectRes = e
    },
    search (e) {
      this.getMaintainDomainInControls({ mdName: e })
    },
    toggleSelect (row) { // 更改选择资源的状态勾选状态
      this.$refs.selection.toggleSelect(this.mdList.findIndex(item => item.mdId === row.mdId))
    },
    ok () {
      if (this.selectRes.length === 0) return this.$Notice.warning({ title: '请选择管理域' })
      this.$emit('callback', {
        handle: 'ok',
        array: this.selectRes
      })
    },
    cancel () {
      this.$emit('callback', {
        handle: 'cancel'
      })
    }
  }

}
</script>
