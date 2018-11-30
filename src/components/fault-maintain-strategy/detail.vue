<template>
  <Modal v-model='data.show' title='故障维护策略详情' :closable="false" :mask-closable="false" :width='800'>
    <Tabs v-model="defaultTab" type="card">
      <TabPane name="1" label="基本信息">
        <Form ref='form' style="width:75%;margin:0 auto;" :label-width='100'>
          <Row :gutter="32">
            <i-col :span="12">
              <FormItem label="开始时间：">
                <span v-text="info.beginTime"></span>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="结束时间：">
                <span v-text="info.endTime"></span>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="名称：">
                <span v-text="info.fmsName"></span>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="维护单位：">
                <span v-text="info.deptName"></span>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="维护人：">
                <span v-text="info.userName"></span>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="自动派单：">
                <span>{{info.dispatchflag ? '是' : '否'}}</span>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="工单处理组：">
                <span v-text="info.grpName"></span>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="状态：">
                <RadioGroup v-model="info.fmsStatus">
                  <Radio disabled :label="1">启用</Radio>
                  <Radio disabled :label="0">禁用</Radio>
                </RadioGroup>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="描述：">
                <span v-text="info.fmsDesc"></span>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </TabPane>
      <TabPane name="2" label="故障类型">
        <CheckboxGroup v-model="info.abnormalTypeIds">
          <Row :gutter="32">
            <i-col class="mb10" :span="8" v-for="(item, index) in abnormalType" :key="index">
              <Tooltip :content="item.abnormalTypeName" placement="top-start">
                <Checkbox disabled :label="item.abnormalTypeId">{{item.abnormalTypeName}}</Checkbox>
              </Tooltip>
            </i-col>
          </Row>
        </CheckboxGroup>
      </TabPane>
      <TabPane name="3" label="故障定义">
        <Table border no-data-text="未选择故障定义" height="335" :columns="faultColumns" :data="faultData"></Table>
      </TabPane>
      <TabPane name="4" label="管理域">
        <Table border no-data-text="未选择维护域" height="335" :columns="domainColumns" :data="mdData"></Table>
      </TabPane>
      <TabPane name="5" label="资源信息">
        <Table border no-data-text="未选择资源" height="335" :columns="resourceColumns" :data="resData"></Table>
      </TabPane>
    </Tabs>
    <div class="m_footer" slot="footer">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="cancel">关闭</Button>
    </div>
  </Modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'FaultMaintainStrategyDetail',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      defaultTab: '1',
      faultData: [], // 选择的故障定义数据
      mdData: [], // 选择的维护域数据
      resData: [],
      faultColumns: [
        {
          title: '故障编码',
          key: 'moAbnormalcode',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moAbnormalcode
              }
            }, row.moAbnormalcode)
          }
        },
        {
          title: '名称',
          key: 'moAbnormalName',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moAbnormalName
              }
            }, row.moAbnormalName)
          }
        },
        {
          title: '故障类型',
          key: 'abnormalType',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.abnormalType.abnormalTypeName
              }
            }, row.abnormalType.abnormalTypeName)
          }
        },
        {
          title: '级别',
          key: 'resAbnormallevel',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormallevel.resAbnormallevelName
              }
            }, row.resAbnormallevel.resAbnormallevelName)
          }
        }],
      domainColumns: [
        {
          title: '序号',
          key: 'mdId',
          ellipsis: true,
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdDesc
              }
            }, row.mdDesc)
          }
        }],
      resourceColumns: [
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
        }]
    }
  },
  computed: {
    info () {
      return this.data.info
    },
    ...mapState({
      abnormalType: state => state.statistics.abnormalType,
      faultDefinition: state => state.statistics.faultDefinition,
      mdList: state => state.device.maintainDomainInControls,
      resList: state => state.device.resList
    })
  },
  watch: {
    info () {
      if (!this.info.fmsId) return
      const detail = this.info
      if (detail.abnormalIds && detail.abnormalIds.length) { // 当前故障定义tab有值
        this.faultData = []
        const data = this.faultDefinition
        detail.abnormalIds.forEach((item) => {
          this.faultData.push(data.find(row => row.moAbnormalId === item))
        })
      }
      if (detail.mdIds && detail.mdIds.length) { // 当前维护域tab有值
        this.mdData = []
        const data = this.mdList
        detail.mdIds.forEach((item) => {
          this.mdData.push(data.find(row => row.mdId === item))
        })
      }
      if (detail.resIds && detail.resIds.length) { // 当前资源tab有值
        this.resData = []
        const data = this.resList
        detail.resIds.forEach((item) => {
          this.resData.push(data.find(row => row.resId === item))
        })
      }
    }
  },
  methods: {
    cancel () {
      this.data.show = false
      this.defaultTab = '1'
    }
  }
}
</script>

<style>
</style>
