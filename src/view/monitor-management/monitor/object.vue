<style lang="less">
.m_title,
.m_content {
  display: inline-block;
  width: 50%;
  vertical-align: top;
  list-style: none;
  & > .ivu-tree-children {
    position: relative;
    top: -8px;
  }
  .ivu-tree-title.active {
    padding-right: 8px;
    line-height: 30px;
    background: #03bcb7;
    color: #fff;
    border-radius: 0;
  }
}
.m_main_list {
  font-size: 12px;
  padding-right: 20px;
  .u_main_item {
    padding-left: 18px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    &:hover {
      background: #f1f1f1;
    }
  }
  .u_main_item.active {
    color: #ffffff;
    background: #04bbb7;
  }
}
</style>

<template>
  <div class="g_user_container">
    <Row :gutter="16" style="height:100%">
      <i-col style="height:100%" :span="5">
        <Card class="m_user_left" shadow bordered>
          <div slot="title">
            <h5 class="m_title">选择资源主类型</h5>
            <h5 class="m_title">选择资源子类型</h5>
          </div>
          <div>
            <ul class="m_content m_main_list">
              <li v-for="(item, index) in mainType" @click.stop="selectMainType(item.resMtypeId, item.resMtypeName, $event)" :key="index" :class="{'active': index === 0}" class="u_main_item">{{item.resMtypeName}}</li>
            </ul>
            <Tree class="m_content" :data="tree"></Tree>
          </div>
        </Card>
      </i-col>
      <i-col style="height:100%" :span="19">
        <Card class="m_user_right" shadow bordered>
          <div class="m_role_header" slot="title">
            <Button class="u_btn u_btn_add" @click="handleAddBtnClick" type="info" size='large'> 添加 </Button>
            <Button class="u_btn" type="error" @click="handleDeleteBtnClick" size='large'> 删除 </Button>
          </div>
          <Table border ref="selection" :columns="columns" :data="kpiObjectList" @on-selection-change="selectionChange"></Table>
        </Card>
      </i-col>
      <monitor-object-form ref="form" :form-data="formData" />
      <confirm :show="showConfirmModal" :operator="confirm.operator" :action="confirm.action" :on-ok="confirm.callback" :confirm-id="confirm.id" />
    </Row>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { Confirm } from '_c/controls'
import MonitorObjectForm from '_c/object/form.vue'
import '@/view/system-management/safety-management/user.less'
export default {
  name: 'ObjectManagement',
  components: {
    Confirm,
    MonitorObjectForm
  },
  data () {
    return {
      resMtype: '', // 主类型id，用于查询子类型节点树
      resStype: '', // 资源子类型id，用于查询监控指标
      skId: '', // 监控对象id
      selectedIds: [],
      confirm: {
        operator: '',
        action: '',
        id: '',
        callback: this.delete
      },
      formData: { // 表单数据
        action: '监测指标新增',
        show: false,
        callback: null,
        type: 1, // 1是新增, 2是修改
        info: {},
        resMtypeName: '', // 主类型名称
        resStypeName: '' // 子类型名称
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'skId',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.skId
              }
            }, row.skId)
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
          title: '主类型名称',
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
          title: '子类型名称',
          key: 'resStypeName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resCurStypeName ? row.resCurStypeName : row.resStypeName
              }
            }, row.resCurStypeName ? row.resCurStypeName : row.resStypeName)
          }
        },
        {
          title: '应用于下属类型',
          key: 'stypeFlag',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.stypeFlag === 1 ? '是' : '否'
              }
            }, row.stypeFlag === 1 ? '是' : '否')
          }
        },
        {
          title: '继承父类型',
          key: 'stypeFlag',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resCurStypeName ? '是' : '否'
              }
            }, row.resCurStypeName ? '是' : '否')
          }
        },
        {
          title: '继承父类型名称',
          key: 'resStypeName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resCurStypeName ? row.resStypeName : ''
              }
            }, row.resCurStypeName ? row.resStypeName : '')
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
                  color: row.resCurStypeName ? '#c1baba' : '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '修改'
                },
                style: {
                  marginRight: '20px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (row.resCurStypeName) return
                    this.formData.action = '监测对象修改'
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
                  color: row.resCurStypeName ? '#c1baba' : '#04bbb7',
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
                    this.confirm.operator = row.moKpiName
                    this.confirm.id = row.skId
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
      mainTypeList: state => state.device.mainTypeList,
      subTypeList: state => state.device.subTypeList,
      kpiObjectList: state => state.device.kpiObjectList
    }),
    mainType () {
      this.resMtype = this.mainTypeList.length ? this.mainTypeList[0].resMtypeId : ''
      this.formData.resMtypeName = this.mainTypeList.length ? this.mainTypeList[0].resMtypeName : ''
      return this.mainTypeList
    },
    tree () {
      const tree = []
      if (this.subTypeList && this.subTypeList.length) {
        this.resStype = this.subTypeList[0].resStypeId
        this.formData.resStypeName = this.subTypeList[0].resStypeName
        this.subTypeList.forEach(item => {
          tree.push(this.makeTree(item))
        })
      }
      return tree
    }
  },
  created () {
    this.getMainTypeList()
    this.getMoKpiList({ 'pageSize': 999 })
  },
  watch: {
    resMtype (current, prev) {
      if (!current) return
      this.getSubTypeList(current)
    },
    resStype (current, prev) {
      if (!current) return
      this.getKpiObjectList(current)
    }
  },
  methods: {
    ...mapMutations(['setShowConfirmModal']),
    ...mapActions([
      'getMainTypeList',
      'getSubTypeList',
      'getKpiObjectList',
      'getMoKpiList',
      'addKpiObject',
      'updateKpiObject',
      'deleteKpiObject'
    ]),
    handleAddBtnClick () {
      this.formData.show = true
      this.formData.action = '监测对象新增'
      this.formData.callback = this.add
      this.formData.type = 1
      this.formData.info = {}
    },
    handleDeleteBtnClick () {
      if (!this.selectedIds.length) return this.$Notice.error({ title: '请先勾选对象再进行删除' })
      this.confirm.operator = '所勾选的对象'
      this.confirm.action = '删除'
      this.confirm.callback = this.batchDelete
      this.confirm.id = ''
      this.setShowConfirmModal(true)
    },
    selectMainType (id, name, $event) { // 主类型点击事件
      [...document.querySelectorAll('.u_main_item')].forEach(item => {
        item.classList.remove('active')
      })
      $event.currentTarget.classList.add('active')
      this.resMtype = id
      this.formData.resMtypeName = name
    },
    selectionChange (e) {
      this.selectedIds = []
      e.forEach(item => {
        this.selectedIds.push(item.skId)
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
    add (params) {
      this.addKpiObject({ ...params, resStypeId: this.resStype }).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '监控对象新增成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getKpiObjectList(this.resStype)
      })
    },
    update (params) {
      this.updateKpiObject(params).then(res => {
        if (res.msg !== 'success') return
        this.$Notice.success({ title: '监控对象修改成功' })
        this.formData.show = false
        this.$refs.form.clear()
        this.getKpiObjectList(this.resStype)
      })
    },
    delete (skId, isFinal = false) {
      this.deleteKpiObject(skId).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '监控对象删除成功' })
        this.setShowConfirmModal(false)
        this.getKpiObjectList(this.resStype)
      })
    },
    makeTree (node) { // 子类型节点树
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
      return h('span', {
        class: data.nodeKey === 0 ? 'ivu-tree-title active' : 'ivu-tree-title', // 默认资源子类型根节点选中
        on: {
          click: e => {
            this.resStype = data.id
            this.formData.resStypeName = data.title;
            [...document.querySelectorAll('.ivu-tree-title')].forEach(item => {
              item.classList.remove('active')
            })
            e.currentTarget.classList.add('active')
          }
        }
      }, [h('span',
        [
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
        ])]
      )
    }
  }
}
</script>
