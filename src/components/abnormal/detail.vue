<template>
  <Modal v-model='data.show' title='告警详细信息' :closable="false" :mask-closable="false" width='900'>
    <Form :label-width='120'>
      <Row :gutter="0">
        <i-col :span="8">
          <FormItem class="mb10" label='告警序号:'>
            <span v-text="detail.resAbnormalId"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='告警名称:'>
            <span v-text="detail.resAbnormalName"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='告警类型:'>
            <span v-text="detail.abnormalTypeName"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='故障编码:'>
            <span v-text="detail.resAbnormalCode"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='发生时间:'>
            <span v-text="detail.resAbnomaltime"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='级别:'>
            <span v-text="detail.resAbnormallevelName"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='告警对象:'>
            <span v-text="detail.resName"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='告警对象别名:'>
            <span v-text="detail.resAlias"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='监控指标:'>
            <span v-text="detail.mokpiName"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='异常发生值:'>
            <span v-text="detail.resAbnormalvalue"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='资源主类型:'>
            <span v-text="detail.resMtypename"></span>
          </FormItem>
        </i-col>
        <i-col :span="8">
          <FormItem class="mb10" label='资源子类型:'>
            <span v-text="detail.resStypeName"></span>
          </FormItem>
        </i-col>
        <i-col :span="24">
          <FormItem class="mb10" label='详细信息:'>
            <span v-text="detail.resAbnormaldesc"></span>
          </FormItem>
        </i-col>
      </Row>

      <Row style="border-top:1px #eee solid;" v-if="detail.confirmStatus === 2">
        <i-col span="8">
          <FormItem class="mb10" label='确认状态:'>
            <span>{{detail.confirmStatus === 1 ? '未确认' : '已确认'}} </span>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem class="mb10" label='确认类型:'>
            <span>{{detail.confirmType === 2 ? '手动确认' : '自动确认'}}</span>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem class="mb10" label='确认人:'>
            <span v-text="detail.confirmUserName"></span>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem class="mb10" label='确认时间:'>
            <span v-text="detail.confirmTime"></span>
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem class="mb10" label='确认信息:'>
            <span v-text="detail.confirmInfo"></span>
          </FormItem>
        </i-col>
      </Row>

      <Row style="border-top:1px #eee solid;" v-if="detail.dispatchType">
        <i-col span="8">
          <FormItem class="mb10" label='派单类型:'>
            <span>{{detail.dispatchType ? (detail.dispatchType === 1 ? '自动派单' : '手动派单') : '未派单'}} </span>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem class="mb10" label='派单人:'>
            <span v-text="detail.dispatchUserName"></span>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem class="mb10" label='派单时间:'>
            <span v-text="detail.dispatchTime"></span>
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem class="mb10" label='关联工单:'>
            <span></span>
          </FormItem>
        </i-col>
      </Row>
    </Form>
    <div class="m_footer" slot="footer" style="">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="data.show = false">关闭</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: 'AbnormalDetail',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    detail () {
      return this.data.info
    }
  }
}
</script>
