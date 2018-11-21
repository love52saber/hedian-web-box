<template>
  <div class="g_role_container">
    <Card class="m_role_content" shadow bordered>
      <div class="m_role_header" slot="title">
        <Button class="u_btn u_btn_add" type="info" size='large'> 添加 </Button>
        <Button class="u_btn" type="error" size='large'> 删除 </Button>
        <Input class="u_search" search enter-button="查询" placeholder="输入角色名称进行搜索" />
      </div>
      <Table border ref="selection" :columns="columns" :data="roleList"></Table>
      <div class="u_page">
        <Page :page-size='pageSize' :total="roleTotal" transfer />
      </div>
    </Card>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import './role.less'
export default {
  name: 'RoleManagement',
  data () {
    return {
      pageIndex: 1,
      pageSize: 15,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'roleId',
          sortable: true,
          ellipsis: true,
          width: 80,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.roleId
              }
            }, row.roleId)
          }
        },
        {
          title: '角色名称',
          key: 'roleName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.roleName
              }
            }, row.roleName)
          }
        },
        {
          title: '备注',
          key: 'remark',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.remark
              }
            }, row.remark)
          }
        },
        {
          title: '操作',
          width: 120,
          align: 'center',
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-eye',
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '详情'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.addObj.action = '详情'
                    this.addObj.addShow = true
                    this.addObj.info = row
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'md-create',
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '修改'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.addObj.action = '编辑'
                    this.addObj.addShow = true
                    this.addObj.info = row
                    this.addObj.addCallback = this.editRole
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'md-trash',
                  color: row.delflag ? '#04bbb7' : '#ccc',
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
                    if (!row.delflag) return
                    this.confirmObj.confirmCallBack = this.deleteRole
                    this.confirmObj.confirmAction = '删除'
                    this.confirmObj.confirmName = row.roleName
                    this.confirmObj.confirmId = row.roleId
                    this.confirmObj.confirmShow = true
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
    this.getRoleList({})
  },
  computed: {
    ...mapState({
      roleList: state => state.user.roleList,
      roleTotal: state => state.user.roleTotal
    })
  },
  methods: {
    ...mapActions([
      'getRoleList'
    ])
  }
}
</script>
