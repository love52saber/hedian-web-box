<template>
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false">
    <Form class="mr20" :model='form' :rules="rules" ref="form" :label-width='100'>
      <FormItem prop="moKpiName" label='指标名称：'>
        <Input v-model='form.moKpiName' placeholder='输入指标名称' :maxlength="20" />
      </FormItem>
      <FormItem prop="moKpiKey" label='关键字：'>
        <Input v-model='form.moKpiKey' placeholder='输入关键字' :maxlength='20' />
      </FormItem>
      <FormItem label='中文单位：'>
        <Input v-model='form.unitCh' placeholder='输入中文单位' :maxlength='20' />
      </FormItem>
      <FormItem label='英文单位：'>
        <Input v-model='form.unitEn' placeholder='输入英文单位' :maxlength='20' />
      </FormItem>
      <FormItem label='备注：'>
        <Input v-model='form.moKpiDesc' type='textarea' placeholder='请输入备注' :autosize='{minRows: 2,maxRows: 5}' :maxlength='100'></Input>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer">
      <Button @click="ok" class="u_btn u_btn_ok" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'MonitorTargetForm',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      form: {
        moKpiName: '',
        moKpiKey: '',
        showorder: 100,
        unitCh: '',
        unitEn: '',
        moKpiDesc: '',
        moKpiId: ''
      },
      rules: {
        moKpiName: [
          { required: true, message: '指标名称不能为空', trigger: 'blur' }
        ],
        moKpiKey: [
          { required: true, message: '关键字不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.$watch('formData', () => {
      if (this.formData.type !== 2) return
      _.forIn(this.form, (v, k) => {
        this.form[k] = this.formData.info[k]
      })
    }, { deep: true })
  },
  methods: {
    ok () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.formData.callback(this.form)
      })
    },
    cancel () { // 点击取消按钮
      this.formData.show = false
      this.clear()
    },
    clear () { // 表单清空
      setTimeout(() => {
        this.form = {
          moKpiName: '',
          moKpiKey: '',
          showorder: 100,
          unitCh: '',
          unitEn: '',
          moKpiDesc: '',
          moKpiId: ''
        }
      }, 300)
    }
  }
}
</script>
