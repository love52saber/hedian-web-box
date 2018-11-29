<template>
  <Modal v-model='data.show' width='1000' title='维护期策略详细信息' :closable="false" :mask-closable="false">
    <Form class="g_user_group_form mr30" :label-width='100'>
      <Row>
        <i-col :span="12">
          <FormItem class="mb10" label='策略标题：'>
            <span v-text="info.msName"></span>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem class="mb10" label='类型：'>
            <span v-text="type"></span>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem class="mb10" label='开始时间：'>
            <span v-text="info.beginTime"></span>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem class="mb10" label='结束时间：'>
            <span v-text="info.endTime"></span>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem class="mb10" label='状态：' prop='msStatus'>
            <RadioGroup v-model="info.msStatus">
              <Radio disabled :label="1">启用</Radio>
              <Radio disabled :label="2">停用</Radio>
            </RadioGroup>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem class="mb10" label='描述：'>
            <span v-text="info.msDesc"></span>
          </FormItem>
        </i-col>
        <i-col :span="24">
          <FormItem class="mb10" label='配置：'>
            <Tabs type="card">
              <TabPane label="资源信息">
                <Table border no-data-text="未添加资源" height="335" :columns="columns" :data="resource"></Table>
              </TabPane>
            </Tabs>
          </FormItem>
        </i-col>
      </Row>
    </Form>
    <div class="m_footer" slot="footer">
      <Button @click="data.show = false" class="u_btn u_btn_ok" type="info" size="large">关闭</Button>
    </div>
  </Modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MaintainStrategyDetail',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      resList: state => state.device.resList
    }),
    resource () {
      const res = []
      if (!this.info.resIds) return res
      this.resList.forEach(item => {
        if (this.info.resIds.findIndex(i => i === item.resId) > -1) {
          res.push(item)
        }
      })
      return res
    },
    info () {
      return this.data.info
    },
    type () {
      if (!this.info.msType) return ''
      return this.msType[this.info.msType]
    }
  },
  data () {
    return {
      msType: {
        '1': '新建',
        '2': '维护',
        '3': '扩建',
        '4': '割接',
        '5': '其他'
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
  }
}
</script>
