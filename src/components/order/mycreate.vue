<style lang="less">
.g_mycreate_container {
  .m_top {
    // width: 98%;
    position: relative;
    border-radius: 5px;
    margin: 5px 15px 0 15px;
    background: #ffffff;
    .u_form_item {
      margin-bottom: 10px;
    }
  }
  .m_bottom {
    position: relative;
    border-radius: 5px;
    // margin: 15px 15px 0 15px;
    padding-top: 5px;
    background: #ffffff;
    .m_btn_group {
      margin-bottom: 16px;
    }
    .u_page {
      text-align: center;
      .ivu-page-item-active {
        background-color: #04bbb7;
        border-color: #04bbb7;
      }
    }
    .rate .ivu-rate-star-full:before,
    .rate .ivu-rate-star-half .ivu-rate-star-content:before {
      color: #27c5c1;
    }
    .fixHeight {
      height: 36px;
    }
  }
}
</style>
<template>
  <div class="g_mycreate_container">
    <Row>
      <Col :lg="24">
      <div class="m_top">
        <Form label-position="left"
          :label-width="85">
          <Row>
            <Col span="6">
            <FormItem class="u_form_item"
              label="工单类型：">
              <Select v-model="form.wfType"
                placeholder='请选择工单类型'>
                <Option :value="''">全部</Option>
                <Option :value="1">维修工单</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="2">&nbsp;</Col>
            <Col span="6">
            <FormItem class="u_form_item"
              label="工单标题：">
              <Input v-model="form.wfTitle"
                placeholder='请输入工单标题' />
            </FormItem>
            </Col>
            <Col span="2">&nbsp;</Col>
            <Col span="6">
            <FormItem class="u_form_item"
              label="告警等级：">
              <Input v-model="form.resAbnormallevelName"
                placeholder="请输入告警等级"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem class="u_form_item"
              label="创建期限：">
              <DatePicker v-model="time.beginTime"
                format="yyyy-MM-dd HH:mm:ss"
                @on-change="timeChanged('beginTime', $event)"
                type="datetime"
                style="width:45%"
                placeholder="请选择开始期限" />
              <span style="display:inline-block;width:10%;text-align:center">一</span>
              <DatePicker v-model="time.endTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                style="width:45%"
                placeholder="请选择结束期限" />
            </FormItem>
            </Col>
            <Col span="2">&nbsp;</Col>
            <Col span="6">
            <FormItem class="u_form_item"
              label="资源名称：">
              <Input v-model="form.resName"
                placeholder="请输入资源名称"></Input>
            </FormItem>
            </Col>
            <Col span="2">&nbsp;</Col>
            <Col span="6">
            <FormItem class="u_form_item"
              label="工单状态:">
              <Select v-model="form.wfStatus">
                <Option :value="item.value"
                  v-for="item in wfStatusList"
                  :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="6"
              style="float:right;margin-right:50px">
            <Button type="primary"
              @click="query"
              style="width:72px;height:33px;background:#04bbb7;border:none;margin-right:20px">查询</Button>
            <Button type="ghost"
              @click="empty"
              style="width:72px;height:33px;">重置</Button>
            </Col>
          </Row>
        </Form>
      </div>
      </Col>
    </Row>
    <Row>
      <Col :lg="24">
      <div class="m_bottom">
        <Table border
          height='520'
          no-data-text='没有相关信息'
          :columns="columns"
          :data="orderList" />
        <div class='u_page'>
          <Page @on-change="pageChanged"
            :total="total"
            :current="pageIndex"
            :page-size="pageSize"></Page>
        </div>
      </div>
      </Col>
    </Row>
    <detail :detail='detail' />
  </div>
</template>
<script>
import detail from './detail'
import { mapState } from 'vuex'
export default {
  components: {
    detail
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          title: '创建人',
          key: 'username',
          ellipsis: true,
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
                  type: 'document-text',
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
  created () {
    this.$store.dispatch('getOrderList', { vue: this, params: { userId: this.userId } })
  },
  mounted () {
    // 监控页码变更
    this.$watch('pageIndex', () => {
      this.$store.dispatch('getOrderList', { vue: this, params: { userId: this.userId, pageIndex: this.pageIndex, ...this.form } })
    })
  },
  computed: {
    ...mapState({
      orderList: state => state.order.myCreate.list,
      flowMap: state => state.order.flowMap,
      userId: state => state.user.info.userId || JSON.parse(localStorage.getItem('userInfo')).userId || '',
      wfStatusList: state => state.order.wfStatusList
    }),
    total () {
      const data = this.$store.state.order.myCreate
      if (data.total && data.total >= this.pageSize && data.list && !data.list.length) {
        this.pageIndex -= 1
      }
      return data.total ? data.total : 1
    },
    relation () {
      return [{
        value: 1,
        label: '大于'
      }, {
        value: 2,
        label: '小于'
      }, {
        value: 3,
        label: '等于'
      }, {
        value: 4,
        label: '大于等于'
      }, {
        value: 5,
        label: '小于等于'
      }]
    },
    score () { // 分数
      return [1, 2, 3, 4, 5]
    }
  },
  methods: {
    query () { // 查询按钮点击事件
      if (this.pageIndex !== 1) {
        this.pageIndex = 1
      } else {
        this.$store.dispatch('getOrderList', { vue: this, params: { ...this.form, userId: this.userId } })
      }
    },
    empty () { // 重置按钮点击事件
      this.form = {
        wfTitle: '', // 工单标题
        resAbnormallevelName: '', // 告警等级
        userName: '', // 创建人
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        currentUserName: '', // 处理人
        wfType: '',
        wfStatus: ''
        // TODO:得分1个字段待加
      }
      this.time = {
        beginTime: '',
        endTime: ''
      }
      this.$store.dispatch('getOrderList', { vue: this, params: { userId: this.userId } })
    },
    pageChanged (e) { // 页码变化更新
      this.pageIndex = e
    }
  }
}
</script>
