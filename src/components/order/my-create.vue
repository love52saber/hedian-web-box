<template>
  <div>
    <Form class="mb20" label-position="left" :label-width="85">
      <Row :gutter="32">
        <i-col :span="8">
          <FormItem class="mb10" label="工单类型：">
            <Select v-model="form.wfType" placeholder='请选择工单类型'>
              <Option :value="''">全部</Option>
              <Option :value="1">维修工单</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label="工单标题：">
            <Input v-model="form.wfTitle" placeholder='请输入工单标题' />
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label="告警等级：">
            <Input v-model="form.resAbnormallevelName" placeholder="请输入告警等级"></Input>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label="创建期限：">
            <DatePicker v-model="time.beginTime" format="yyyy-MM-dd HH:mm:ss" @on-change="timeChanged('beginTime', $event)" type="datetime" style="width:45%" placeholder="请选择开始期限" />
            <span style="display:inline-block;width:10%;text-align:center">一</span>
            <DatePicker v-model="time.endTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width:45%" placeholder="请选择结束期限" />
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label="资源名称：">
            <Input v-model="form.resName" placeholder="请输入资源名称"></Input>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label="工单状态:">
            <Select v-model="form.wfStatus">
              <Option :value="item.value" v-for="item in wfStatusList" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :push="18" :span="6">
          <Button @click.stop="query" class="mr10" type="info">查询</Button>
          <Button @click.stop="empty">重置</Button>
        </i-col>
      </Row>
    </Form>
    <Table border no-data-text='没有相关信息' :columns="columns" :data="myCreateList" />
    <div class="u_page">
      <Page @on-change="pageChanged" :current="pageIndex" :page-size='pageSize' :total="total" transfer />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'MyCreate',
  data () {
    return {
      pageIndex: 1,
      pageSize: 12,
      form: {
        wfTitle: '', // 工单标题
        resAbnormallevelName: '', // 告警等级
        userName: '', // 创建人
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        currentUserName: '', // 处理人
        wfType: '', // 工单类型
        wfStatus: ''
        // TODO:得分三个字段待加
      },
      time: {
        beginTime: '',
        endTime: ''
      },
      detail: {
        show: false,
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
          width: 80,
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
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    // console.log('详细信息=', JSON.stringify(row))
                    this.detail.info = row
                    this.detail.show = true
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
      myCreateList: state => state.order.myCreateList,
      flowMap: state => state.order.flowMap,
      total: state => state.order.myCreateTotal,
      wfStatusList: state => state.order.wfStatusList
    })
  },
  created () {
    this.getOrderList({ userId: this.userId, pageSize: this.pageSize, pageIndex: this.pageIndex, ...this.form })
  },
  watch: {
    pageIndex () {
      this.getOrderList({ userId: this.userId, pageSize: this.pageSize, pageIndex: this.pageIndex, ...this.form })
    }
  },
  methods: {
    ...mapActions(['getOrderList']),
    query () {
      this.getOrderList({ userId: this.userId, pageSize: this.pageSize, pageIndex: this.pageIndex, ...this.form })
    },
    empty () {
      this.form = {
        wfTitle: '', // 工单标题
        resAbnormallevelName: '', // 告警等级
        userName: '', // 创建人
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        currentUserName: '', // 处理人
        wfType: '', // 工单类型
        wfStatus: ''
        // TODO:得分三个字段待加
      }
      this.time = {
        beginTime: '',
        endTime: ''
      }
      this.getOrderList({ userId: this.userId, pageIndex: this.pageIndex, pageSize: this.pageSize })
    },
    pageChanged (e) {
      this.pageIndex = e
    }
  }

}
</script>

<style>
</style>
