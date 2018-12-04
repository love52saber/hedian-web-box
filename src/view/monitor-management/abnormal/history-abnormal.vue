<style lang="less">
.g_TB_container {
  // border: 1px red solid;
  padding: 15px;
  .m_bottom_content {
    height: 100%;
  }
}
</style>

<template>
  <div class="g_TB_container">
    <Card class="m_top_content mb30" shadow bordered>
      <Form :label-width="100">
        <Row :gutter="80">
          <i-col :span="8">
            <FormItem class="mb10" label="开始时间：">
              <DatePicker format="yyyy-MM-dd HH:mm:ss" v-model="time.begin" type="datetime" @on-change="timeChanged('beginTime', $event)" style="width:100%" placeholder="请选择开始时间" />
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="结束时间：">
              <DatePicker type="datetime" v-model="time.end" format="yyyy-MM-dd HH:mm:ss" @on-change="timeChanged('endTime', $event)" style="width:100%" placeholder="请选择结束时间" />
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="确认状态：">
              <Select v-model="form.conStatus" placeholder='请选择确认状态'>
                <Option :value="''">全部</Option>
                <Option :value="1">未确认</Option>
                <Option :value="2">已确认</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="级别：">
              <Input v-model="form.abnormalLevel" placeholder="请输入级别"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警类型：">
              <Input v-model="form.abnormalType" placeholder="请输入告警类型"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警名称：">
              <Input v-model="form.abnormalName" placeholder="请输入告警名称"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警对象:">
              <Input v-model="form.resName" placeholder="请输入告警对象名称"></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警指标：">
              <Input v-model="form.mokpiName" placeholder="请输入告警指标："></Input>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem class="mb10" label="告警对象别名：">
              <Input v-model="form.resAlias" placeholder="请输入告警对象别名"></Input>
            </FormItem>
          </i-col>
          <i-col :push="16" :span="8">
            <Checkbox v-model="form.isAutoOrder">已派单</Checkbox>
            <Checkbox v-model="form.useflag">已删除</Checkbox>
            <Button @click.stop="query" class="mr20" type="primary">查询</Button>
            <Button @click.stop="empty" type="default">重置</Button>
          </i-col>
        </Row>
      </Form>
    </Card>
    <Card class="m_bottom_content" shadow bordered style="padding-top:20px">
      <Table border ref="selection" height="461" :columns="columns" :data="historyAbnormalList" />
      <div class="u_page">
        <Page @on-change="pageChanged" :current="pageIndex" :page-size='pageSize' :total="historyAbnormalTotal" transfer />
      </div>
    </Card>
    <abnormal-detail :data="detail" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AbnormalDetail from '_c/abnormal/detail'
export default {
  name: 'HistoryAbnormal',
  components: {
    AbnormalDetail
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      form: {
        beginTime: '',
        endTime: '',
        abnormalLevel: '',
        abnormalType: '',
        abnormalName: '',
        mokpiName: '',
        resName: '',
        resAlias: '',
        isAutoOrder: false,
        useflag: false
      },
      time: { // 临时存储时间选择插件的双向数据绑定，便于清除value，实际数据为form.beginTime,form.endTime
        begin: '',
        end: ''
      },
      detail: {
        show: false,
        info: {}
      },
      columns: [
        {
          title: '序号',
          key: 'resAbnormalId',
          ellipsis: true,
          align: 'center',
          width: 80,
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormalId
              }
            }, row.resAbnormalId)
          }
        },
        {
          title: '告警对象',
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
          title: '告警对象别名',
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
          title: '确认状态',
          key: 'confirmStatus',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.confirmStatus === 1 ? '未确认' : '已确认'
              }
            }, row.confirmStatus === 1 ? '未确认' : '已确认')
          }
        },
        {
          title: '级别',
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
          title: '告警类型',
          key: 'abnormalTypeName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.abnormalTypeName
              }
            }, row.abnormalTypeName)
          }
        },
        {
          title: '告警名称',
          key: 'resAbnormalName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormalName
              }
            }, row.resAbnormalName)
          }
        },
        {
          title: '告警指标',
          key: 'mokpiName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mokpiName
              }
            }, row.mokpiName)
          }
        },
        {
          title: '发生时间',
          key: 'beginTime',
          ellipsis: true,
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnomaltime
              }
            }, row.resAbnomaltime)
          }
        },
        // TODO:关联工单暂时没有，空着先
        {
          title: '关联工单',
          key: 'dispatchTicketId',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: ''
              }
            }, '')
          }
        },
        {
          title: '描述',
          key: 'resAbnormaldesc',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormaldesc
              }
            }, row.resAbnormaldesc)
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
                  title: '详细信息'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
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
    this.getHistoryAbnormalList({})
  },
  computed: {
    ...mapState({
      historyAbnormalList: state => state.abnormal.historyAbnormalList,
      historyAbnormalTotal: state => state.abnormal.historyAbnormalTotal
    })
  },
  methods: {
    ...mapActions([
      'getHistoryAbnormalList'
    ]),
    pageChanged (e) { // 页码变化更新
      this.pageIndex = e
    },
    timeChanged (name, e) { // 时间格式化为yyyy-MM-dd HH:mm:ss
      this.form[name] = e
    },
    query () { // 查询按钮点击事件
      this.getHistoryAbnormalList({ pageIndex: this.pageIndex, ...this.form })
    },
    empty () { // 重置按钮点击事件
      this.form = {
        beginTime: '',
        endTime: '',
        abnormalLevel: '',
        abnormalType: '',
        abnormalName: '',
        mokpiName: '',
        resName: '',
        resAlias: '',
        isAutoOrder: false,
        useflag: false
      }
      this.time = {
        begin: '',
        end: ''
      }
      this.getHistoryAbnormalList({ pageIndex: this.pageIndex, ...this.form })
    }
  }
}
</script>
