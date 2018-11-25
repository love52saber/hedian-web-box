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
  <Modal :z-index="1002" v-model="show" title='选择资源' :closable="false" :mask-closable="false" width='1100'>
    <Row :gutter="32" justify="center">
      <i-col class="mb10" :span="8">
        <Input v-model="form.resName" placeholder="输入名称搜索">
        <span slot="prepend">名称</span>
        </Input>
      </i-col>
      <i-col class="mb10" :span="8">
        <Input v-model="form.resIpv4" placeholder="输入IP地址搜索">
        <span slot="prepend">IP地址</span>
        </Input>
      </i-col>
      <i-col class="mb10" :span="8">
        <Input v-model="form.resAddress" placeholder="输入地址搜索">
        <span slot="prepend">地址</span>
        </Input>
      </i-col>
      <i-col class="mb10" :span="8">
        <Input v-model="form.resSerialnumber" placeholder="输入编码搜索">
        <span slot="prepend">编码</span>
        </Input>
      </i-col>
      <i-col v-show="!isFixedMainType" class="mb10" :span="8">
        <Select :disabled="isFixedMainType" v-model="form.resMainType" placeholder='选择主类型'>
          <Option :value="''">全部</Option>
          <Option v-for="item in mainType" :value="item.resMtypeId" :key="item.resMtypeId">{{ item.resMtypeName }}</Option>
        </Select>
      </i-col>
      <i-col class="mb10" :span="8">
        <Input v-model="subTypeName" readonly @on-click='subTypeShow = !subTypeShow' placeholder='选择子类型' :icon="subTypeShow ? 'ios-arrow-up' : 'ios-arrow-down'" />
        <div class="m_tree_box" v-show="subTypeShow">
          <Tree class='m_tree' :data='tree'></Tree>
        </div>
      </i-col>
      <i-col class="mb10" :push="isFixedMainType ? 0 : 16" :span="8">
        <Button @click.stop="empty" class="fr">重置</Button>
        <Button @click.stop="query" class="fr mr10" type="info">查询</Button>
      </i-col>
    </Row>
    <Table class="mr10 ml10 mt10" border ref="selection" @on-selection-change='selectChange' height="335" :columns="patternRender" :data="resList"></Table>
    <div slot="footer" class="m_footer">
      <Button @click="ok" class="u_btn u_btn_ok" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Resource',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pattern: { // 模式参数， 1为多选模式，0为单选模式
      type: Number,
      default: 0
    },
    isFixedMainType: { // 是否固定主类型
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      subTypeShow: false,
      subTypeName: '',
      selectRes: [],
      form: {
        resName: '',
        resIpv4: '',
        resAddress: '',
        resSerialnumber: '',
        resMainType: '',
        resSubtype: ''
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
                this.resList.map(x => {
                  x.selected = false
                })
                this.resList[params.index].selected = val
                this.selectRes = [this.resList[params.index]]
              }
            }
          })
        }
      },
      columns: [
        {
          title: '编码',
          key: 'resSerialnumber',
          ellipsis: true,
          className: 'fixHeight',
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
          title: '别名',
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
          title: '主类型',
          key: 'resMainType',
          ellipsis: true,
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
          align: 'center',
          width: 170,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAddress
              }
            }, row.resAddress)
          }
        }
      ]
    }
  },
  created () {
    this.getMainTypeList()
    this.getSubTypeList()
    this.getResList(this.form)
  },
  computed: {
    ...mapState({
      mainTypeList: state => state.device.mainTypeList,
      subTypeList: state => state.device.subTypeList,
      resList: state => state.device.resList
    }),
    mainType () {
      if (this.mainTypeList.length === 0) return []
      if (this.isFixedMainType) this.form.resMainType = this.mainTypeList[0].resMtypeId
      return this.mainTypeList
    },
    patternRender () { // 根据父组件传值进来的pattern渲染单选还是多选模式 1为多选 0为单选
      (this.columns[0].isSingle) ? this.columns.splice(0, 1) : console.log(this.columns)
      this.pattern ? this.columns.unshift(this.pattern1) : this.columns.unshift(this.pattern0)
      return this.columns
    },
    tree () {
      let menuTree = []
      if (this.subTypeList && this.subTypeList.length) {
        this.subTypeList.forEach(item => {
          menuTree.push(this.makeTree(item))
        })
      }
      return menuTree
    }
  },
  watch: {
    'form.resMainType' (current, prev) {
      if (current === undefined) this.form.resMainType = ''
      this.subTypeShow = false
      this.subTypeName = ''
      this.form.resSubtype = ''
      if (this.isFixedMainType) this.getResList(this.form)
      this.getSubTypeList(this.form.resMainType)
    }
  },
  methods: {
    ...mapActions([
      'getMainTypeList',
      'getSubTypeList',
      'getResList'
    ]),
    selectChange (e) {
      this.selectRes = e
    },
    ok () {
      if (this.selectRes.length === 0) return this.$Notice.warning({ title: '请选择资源' })
      this.$emit('callback', {
        handle: 'ok',
        target: 'resource',
        array: this.selectRes
      })
    },
    cancel () {
      this.$emit('callback', {
        handle: 'cancel',
        target: 'resource'
      })
    },
    query () { // 查询按钮点击事件
      this.getResList(this.form)
    },
    empty () {
      this.form = {
        resName: '',
        resIpv4: '',
        resAddress: '',
        resSerialnumber: '',
        resMainType: this.isFixedMainType ? this.form.resMainType : '', // 固定主类型时主类型id不能改变
        resSubtype: ''
      }
      this.subTypeName = ''
      this.getResList(this.form)
    },
    toggleSelect (row) { // 更改选择资源的状态勾选状态
      this.$refs.selection.toggleSelect(this.resList.findIndex(item => item.resId === row.resId))
    },
    makeTree (node) {
      let n = {
        id: node.resStypeId,
        title: node.resStypeName,
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
      return h(
        'span',
        {
          class: 'ivu-tree-title',
          on: {
            click: e => {
              this.subTypeShow = !this.subTypeShow
              this.subTypeName = data.title
              this.form.resSubtype = data.id
            }
          }
        },
        [
          h('span', [
            h('Icon', {
              props: {
                type: 'folder',
                size: 18
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ])
        ]
      )
    }
  }
}
</script>
