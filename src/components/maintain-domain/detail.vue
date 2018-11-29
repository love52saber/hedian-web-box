<template>
  <Modal v-model='data.show' width='1000' title='维护域详细信息' :closable="false" :mask-closable="false">
    <Form class="mr30" :label-width='120'>
      <FormItem class="mb10" label="维护域名称：">
        <span v-text="info.mdName"></span>
      </FormItem>
      <FormItem class="mb10" label='描述：'>
        <span v-text="info.mdDesc"></span>
      </FormItem>
      <FormItem class="mb10" label='配置：'>
        <Tabs v-model="defaultTab" type="card">
          <TabPane name="1" label="资源信息">
            <Table border no-data-text="还未添加资源" ref="selection" height="335" :columns="columns" :data="resource"></Table>
          </TabPane>
          <TabPane name="2" label="单位信息">
            <Tree class='m_tree' show-checkbox :data='tree'></Tree>
          </TabPane>
          <TabPane name="3" label="个人信息">
            <Row :gutter="32">
              <i-col style="text-align:center" v-if="user.length === 0" :span="24">没有用户信息</i-col>
              <i-col style="text-align:center" v-if="user.length !== 0" :span="24">用户信息以“姓名/用户名/组织机构”格式显示</i-col>
              <i-col style="font-size:15px;font-weight:650" v-if="user.length !== 0" v-for="item in user" :key="item.userId" :span="8">{{item.name}}/{{item.username}}/{{item.sysDept ? item.sysDept.name : ''}}</i-col>
            </Row>
          </TabPane>
        </Tabs>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer" style="">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="cancel">关闭</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'MaintainDomainDetail',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      defaultTab: '1',
      columns: [
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
        }
      ]
    }
  },
  computed: {
    ...mapState({
      resList: state => state.device.resList,
      unitList: state => state.user.organizationalUnit
    }),
    info () {
      return this.data.data
    },
    resource () {
      const data = []
      if (!this.info.resIds) return data
      this.resList.forEach(item => {
        const index = this.info.resIds.findIndex(i => i === item.resId)
        if (index !== -1) data.push(item)
      })
      return data
    },
    tree () { // 部门机构树数据
      let menuTree = []
      if (this.unitList && this.unitList.length) {
        this.unitList.forEach(item => {
          menuTree.push(this.makeTree(item, this.info.deptIds || []))
        })
      }
      return menuTree
    },
    user () {
      return this.info.sysUsers || []
    }
  },
  methods: {
    cancel () {
      this.data.show = false
      this.defaultTab = '1'
    },
    makeTree (node, deptIds) {
      let n = {
        id: node.deptId,
        title: node.name,
        expand: true,
        render: this.render,
        disabled: true,
        checked: deptIds.findIndex(item => item === node.deptId) !== -1,
        children: []
      }
      if (node.children) {
        node.children.forEach(e => {
          n.children.push(this.makeTree(e, deptIds))
        })
      }
      return n
    },
    render (h, { root, node, data }) {
      return h('span',
        {
          class: 'ivu-tree-title'
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
          h('span', data.title)
        ])]
      )
    }
  }
}
</script>
