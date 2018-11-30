<template>
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false">
    <Form style="width:75%;margin: 0 auto;" ref='form' :rules='rules' :model='form' :label-width='120'>
      <FormItem label='主类型名称：' prop='moKpiName'>
        <Input v-model='formData.resMtypeName' placeholder='主类型名称' disabled :maxlength=20 />
      </FormItem>
      <FormItem label='子类型名称：'>
        <Input v-model='formData.resStypeName' disabled placeholder='子类型名称' :maxlength=20 />
      </FormItem>
      <FormItem label='应用于下属类型：' prop="stypeFlag">
        <Select v-model="form.stypeFlag">
          <Option :value="1">是</Option>
          <Option :value="2">否</Option>
        </Select>
      </FormItem>
      <FormItem label='指标名称：' prop="moKpiId">
        <Select :disabled="formData.type === 2" v-model="form.moKpiId">
          <Option :value="item.moKpiId" v-for="(item, index) in moKpiList" :key="index">{{item.moKpiName}}</Option>
        </Select>
      </FormItem>
      <FormItem label='指标描述：'>
        <Input readonly v-model="label" placeholder="选择指标后会自动带出">
        </Input>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="ok">确定</Button>
      <Button class="u_btn" type="default" size="large" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import mixin from '@/mixin'
export default {
  name: 'MonitorObjectForm',
  mixins: [mixin],
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      form: {
        moKpiId: '',
        stypeFlag: '',
        skId: ''
      },
      rules: {
        moKpiId: [
          { required: true, type: 'number', message: '指标名称不能为空', trigger: 'change' }
        ],
        stypeFlag: [
          { required: true, type: 'number', message: '请选择继承类型', trigger: 'change' }
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
  computed: {
    ...mapState({
      moKpiList: state => state.device.moKpiList
    }),
    label () {
      const kpiList = this.moKpiList
      let label = ''
      if (kpiList.findIndex(item => item.moKpiId === this.form.moKpiId) > -1 && this.formData.type !== 2) { // 新增状态时选择了指标，可以查找到对应index
        label = kpiList[kpiList.findIndex(item => item.moKpiId === this.form.moKpiId)].moKpiDesc
      } else {
        label = this.formData.info.moKpiDesc
      }
      return label
    }
  },
  methods: {
    ok () { // 点击确定按钮
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
          moKpiId: '',
          stypeFlag: ''
        }
        this.$refs['form'].resetFields()
      }, 300)
    }
  }
}
</script>
