<template>
  <div>
    <Table border height='671' no-data-text='没有相关信息' :columns="columns" :data="todoList" />
    <div class="u_page">
      <Page @on-change="pageChanged" :current="pageIndex" :page-size='pageSize' :total="total" transfer />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'MyTodo',
  data () {
    return {
      pageIndex: 1,
      pageSize: 15,
      pickPersonShow: false,
      detail: {
        show: false,
        info: {}
      },
      workflow: {
        show: false,
        title: '处理工单',
        info: {}
      },
      columns: [
        {
          title: '序号',
          key: 'businessId',
          width: 80,
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.businessId
              }
            }, row.businessId)
          }
        },
        {
          title: '工单编号',
          key: 'wfId',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.wfId
              }
            }, row.wfId)
          }
        },
        {
          title: '工单标题',
          key: 'wfTitle',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.wfTitle
              }
            }, row.wfTitle)
          }
        },
        {
          title: '工单类型',
          key: 'wfType',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: '维修工单'
              }
            }, '维修工单')
          }
        },
        {
          title: '告警等级',
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
          title: '创建人',
          key: 'username',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.username
              }
            }, row.username)
          }
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.gmtCreate
              }
            }, row.gmtCreate)
          }
        },
        {
          title: '当前节点',
          key: 'currentStep',
          ellipsis: true,
          sortable: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: !row.wfStatus ? this.flowMap[row.currentStep] : '已完成'
              }
            }, !row.wfStatus ? this.flowMap[row.currentStep] : '已完成')
          }
        },
        {
          title: '处理人',
          key: 'currentUserName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.currentUserName
              }
            }, row.currentUserName)
          }
        },
        {
          title: '期望解决时长',
          key: 'hopetime',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.hopetime + '小时'
              }
            }, row.hopetime + '小时')
          }
        },
        {
          title: '最晚解决时长',
          key: 'endTime',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.deadtime + '小时'
              }
            }, row.deadtime + '小时')
          }
        },
        {
          title: '最终得分',
          key: 'woEvalScore',
          ellipsis: true,
          width: 180,
          align: 'center',
          render: (h, { row }) => {
            if (row.woEvalScore === undefined) {
              return h('span', '—')
            } else {
              return h('Rate', {
                props: {
                  value: 3.2,
                  disabled: true,
                  'allow-half': true
                },
                class: 'rate'
              }, '')
            }
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
                  type: window.config.DETAIL_ICON,
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
                    this.detail.info = row
                    this.detail.show = true
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'md-hand',
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '处理'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (row.currentStep > 0) {
                      this.workflow.info = row
                      this.workflow.show = true
                    } else {
                      this.$store.commit('setSubmitToReview', {
                        taskId: row.taskId,
                        currentStep: row.currentStep,
                        businessId: row.businessId
                      })
                      this.pickPersonShow = true
                    }
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
      userId: state => state.user.userId,
      todoList: state => state.order.myTodoList,
      flowMap: state => state.order.flowMap,
      total: state => state.order.myTodoTotal
    })
  },
  created () {
    this.getOrderList({ currentUser: this.userId, pageSize: this.pageSize, pageIndex: this.pageIndex, wfStatus: 0 })
  },
  watch: {
    pageIndex () {
      this.getOrderList({ currentUser: this.userId, pageSize: this.pageSize, pageIndex: this.pageIndex, wfStatus: 0 })
    }
  },
  methods: {
    ...mapActions(['getOrderList']),
    pageChanged (e) {
      this.pageIndex = e
    }
  }
}
</script>

<style>
</style>
