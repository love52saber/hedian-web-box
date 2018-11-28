<style lang='less' scoped>
</style>
<template>
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false">
    <Form ref="form" style="padding-right: 30px" :label-width='100'>
      <FormItem class="mb10" label='告警内容:'>{{info.resAbnormaldesc || info.alarmDesc}}</FormItem>
      <FormItem class="mb10" label='发生时间:'>{{info.resAbnomaltime || info.alarmTime}}</FormItem>
      <FormItem class="mb10" label='告警级别:'>{{info.resAbnormallevelName || info.alarmLevel}}</FormItem>
      <FormItem class="mb10" label='处理意见:'>
        <Input type="textarea" v-model="inputValue" :autosize="{minRows: 2,maxRows: 5}" :maxlength='100' placeholder="请输入处理意见,不超过100字"></Input>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer">
      <Button class="u_btn u_btn_add" @click="ok" type="info" size="large">确定</Button>
      <Button class="u_btn" v-if="formData.type !== 0" @click="cancel" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: 'AbnormalForm',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      inputValue: ''
    }
  },
  computed: {
    info () {
      return this.formData.info
    }
  },
  methods: {
    ok () {
      this.formData.callback({ resAbnormalId: this.info.resAbnormalId, value: this.inputValue }, true)
    },
    cancel () {
      this.formData.show = false
      this.clear()
    },
    clear () {
      setTimeout(() => {
        this.form = {
          inputValue: ''
        }
      }, 0)
    }
  }
}
</script>
