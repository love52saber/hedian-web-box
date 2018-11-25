<template>
  <Modal v-model='data.show' title='监测指标详情' :closable="false" :mask-closable="false">
    <Form class="mr30" :label-width='120'>
      <FormItem class="mb10" label="指标名称：">
        <Input v-model='info.moKpiName' placeholder='未输入指标名称' readonly />
      </FormItem>
      <FormItem class="mb10" label="关键字：">
        <Input v-model='info.moKpiKey' placeholder='未输入关键字' readonly />
      </FormItem>
      <FormItem class="mb10" label="中文单位：">
        <Input v-model='info.unitCh' placeholder='未输入中文单位' readonly />
      </FormItem>
      <FormItem class="mb10" label="英文单位：">
        <Input v-model='info.unitEn' placeholder='未输入英文单位' readonly />
      </FormItem>
      <FormItem class="mb10" label="备注：">
        <Input type='textarea' :autosize='{minRows: 2,maxRows: 5}' v-model='info.moKpiDesc' placeholder='未输入备注：' readonly />
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer" style="">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="data.show = false">关闭</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: 'MonitorTargetDetail',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    info () {
      return this.data.data
    }
  }
}
</script>
