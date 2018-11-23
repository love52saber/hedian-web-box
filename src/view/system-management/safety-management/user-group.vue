<template>
  <div class="g_role_container">
    <Card class="m_role_content" shadow bordered>
      <div class="m_role_header" slot="title">
        <Button class="u_btn u_btn_add" @click="handleAddBtnClick" type="info" size='large'> 添加 </Button>
        <Button class="u_btn" type="error" @click="handleDeleteBtnClick" size='large'> 删除 </Button>
        <Input class="u_search" v-model="grpName" @on-search="handleSearch" search enter-button="查询" placeholder="输入用户组名称进行搜索,可以使用回车键" />
      </div>
      <Table border ref="selection" :columns="columns" :data="userGroupList" @on-selection-change="selectionChange"></Table>
      <div class="u_page">
        <Page @on-change="pageChanged" :page-size='pageSize' :total="total" transfer />
      </div>
    </Card>
    <user-group-detail :data="detail" />
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" :confirm-id="confirm.id" />
  </div>
</template>
<script>
import './role.less'
import { Confirm } from '_c/controls'
import UserGroupDetail from '_c/user-group/detail.vue'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'UserGroupManagement',
  components: {
    Confirm,
    UserGroupDetail
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 15,
      grpName: '',
      selectedIds: [],
      detail: {
        show: false,
        data: {}
      },
      confirm: {
        operator: '',
        action: '',
        id: '',
        callback: this.delete
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'grpId',
          width: 80,
          sortable: true,
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.grpId
              }
            }, row.grpId)
          }
        },
        {
          title: '用户组名',
          key: 'grpName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.grpName
              }
            }, row.grpName)
          }
        },
        {
          title: '用户组类型',
          key: 'grpType',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.grpType === 1 ? '普通用户组' : '工单处理组'
              }
            }, row.grpType === 1 ? '普通用户组' : '工单处理组')
          }
        },
        {
          title: '描述',
          key: 'grpDesc',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.grpDesc
              }
            }, row.grpDesc)
          }
        },
        {
          title: '操作',
          width: 150,
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
                  title: '查看'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    console.log(row)
                    this.detail.show = true
                    this.detail.data = row
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
                    // this.addObj.action = '用户组编辑'
                    // this.addObj.callback = this.updateGroup
                    // this.addObj.info = row
                    // this.addObj.show = true
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'md-trash',
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
                    if (!row.delflag) {
                      this.$Message.error(row.grpName + '不可被删除')
                    }
                    // this.confirmObj.confirmAction = '删除'
                    // this.confirmObj.confirmName = row.grpName
                    // this.confirmObj.confirmShow = true
                    // this.confirmObj.confirmCallBack = this.deleteGroup
                    // this.confirmObj.confirmId = row.grpId
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
    this.getUserGroupList({})
    this.getAllRoleList()
    this.getUserList({ pageSize: 9999 })
  },
  computed: {
    ...mapState({
      userGroupList: state => state.user.userGroupList,
      userGroupTotal: state => state.user.userGroupTotal,
      showConfirmModal: state => state.app.showConfirmModal
    }),
    total () {
      if (this.userGroupTotal >= this.pageSize && this.userGroupList.length === 0) {
        this.pageIndex -= 1
      }
      return this.userGroupTotal
    }
  },
  watch: {
    pageIndex (current, pre) {
      this.getUserGroupList({ pageIndex: this.pageIndex, grpName: this.grpName })
    }
  },
  methods: {
    ...mapActions([
      'getUserGroupList',
      'getAllRoleList',
      'getUserList'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    handleAddBtnClick () { },
    handleDeleteBtnClick () { },
    handleSearch () {
      this.getUserGroupList({ grpName: this.grpName, pageIndex: 1 })
    },
    pageChanged (e) { // 页码跳转
      this.pageIndex = e
    },
    selectionChange (e) {
      this.selectedIds = []
      e.map((item) => {
        this.selectedIds.push(item.grpId)
      })
    }
  }
}
</script>
