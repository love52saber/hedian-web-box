<style lang="less">
.u_name {
  color: #04bbb7;
  font-weight: 800;
}
</style>

<template>
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false" width="800">
    <Form :model='form' :rules="rules" ref="form" style="padding-right: 30px" :label-width='100'>
      <FormItem label="指标：" prop="moKpiId">
        <Row>
          <i-col :span="8">资源主类型：
            <span class="u_name" v-text="targetKpiData.resMtypeName"></span>
          </i-col>
          <i-col :span="8">资源子类型：
            <span class="u_name" v-text="targetKpiData.resStypeName"></span>
          </i-col>
          <i-col :span="4">指标名称：
            <span class="u_name" v-text="targetKpiData.moKpiName"></span>
          </i-col>
          <i-col :push="2" :span="3">
            <Button type="primary" @click="targetShow = true" style="border:none;background:#04bbb7">选择</Button>
          </i-col>
        </Row>
      </FormItem>
      <Row>
        <i-col :span="12">
          <FormItem label="类型：">
            <Select v-model="form.moThType" @on-change="typeChange" placeholder='请选择类型'>
              <Option v-for="item in thresholdType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem prop="moThBase" label="基准值：">
            <Input :disabled='form.moThType!==3 && form.moThType!==4' v-model.number="form.moThBase" placeholder="请输入基准值">
            </Input>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem prop="moThUp" label="上限值：">
            <Input :disabled='form.moThType==5' v-model.number="form.moThUp" placeholder="请输入上限值">
            </Input>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem prop="moThDown" label="下限值：">
            <Input :disabled='form.moThType==5' v-model.number="form.moThDown" placeholder="请输入下限值">
            </Input>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem prop="moThValue" label="对比值：">
            <Input :disabled='form.moThType!=5' v-model.number="form.moThValue" placeholder="请输入对比值">
            </Input>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem label="包含边界值：">
            <RadioGroup v-model="form.moThInupdown">
              <Radio :disabled='form.moThType==5' :label="1" style="margin:0 25px">是</Radio>
              <Radio :disabled='form.moThType==5' :label='0'>否</Radio>
            </RadioGroup>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem prop="moThPriority" label="优先级：">
            <Input v-model.number="form.moThPriority" placeholder="请输入优先级，必须为数字"> </Input>
          </FormItem>
        </i-col>
        <i-col :span="12">
          <FormItem prop="moAbnormalId" label="告警名称：">
            <Input readonly v-model="faultData.moAbnormalName" placeholder="请选择告警信息">
            <span slot="append">
              <Button style="border:none;background:#04bbb7;color:#fff" @click="faultShow = true" type="primary">选择</Button>
            </span>
            </Input>
          </FormItem>
        </i-col>
      </Row>
    </Form>
    <div class="m_footer" slot="footer">
      <Button class="u_btn u_btn_add" @click="ok" type="info" size="large">确定</Button>
      <Button class="u_btn" v-if="formData.type !== 0" @click="cancel" type="default" size="large">取消</Button>
    </div>
    <fault ref="fault" :show="faultShow" @callback="selectFault" />
    <target ref="target" :show="targetShow" @callback="selectTarget" />
  </Modal>
</template>
<script>
import { Fault, Target } from '_c/controls'
import _ from 'lodash'
export default {
  name: 'ThresholdForm',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  components: {
    Fault,
    Target
  },
  data () {
    const moThBase = (rule, value, callback) => {
      if (value === '' && (this.form.moThType === 3 || this.form.moThType === 4)) {
        callback(new Error('请填写基准值'))
      } else {
        callback()
      }
    }
    const moThUp = (rule, value, callback) => {
      if (value === '' && this.form.moThDown === '' && this.form.moThType === 1) {
        callback(new Error('上下限类型需要填写至少一个极限值'))
      } else if (value === '' && this.form.moThType === 2) {
        callback(new Error('区间类型需要极限值必填'))
      } else if (value < this.form.moThDown && (this.form.moThType === 2 || this.form.moThType === 4)) {
        callback(new Error('上限值不能低于下限值'))
      } else if (value === '' && this.form.moThType === 3 && this.form.moThDown === '') {
        callback(new Error('上下限至少填写一个'))
      } else if (value === '' && this.form.moThType === 4) {
        callback(new Error('基准值区间类型上限值必填'))
      } else {
        callback()
      }
    }
    const moThDown = (rule, value, callback) => {
      if (value === '' && this.form.moThUp === '' && this.form.moThType === 1) {
        callback(new Error('上下限类型需要填写至少一个极限值'))
      } else if (value === '' && this.form.moThType === 2) {
        callback(new Error('区间类型需要填写极限值必填'))
      } else if (value === '' && this.form.moThType === 3 && this.form.moThUp === '') {
        callback(new Error('上下限至少填写一个'))
      } else if (value === '' && this.form.moThType === 4) {
        callback(new Error('基准值区间类型下限值必填'))
      } else {
        callback()
      }
    }
    const moThValue = (rule, value, callback) => {
      if (value === '' && this.form.moThType === 5) {
        callback(new Error('等值类型需要填写对比值'))
      } else {
        callback()
      }
    }
    return {
      targetShow: false,
      targetKpiData: {}, // 选择的指标kpi
      faultData: {}, // 选择的故障定义数据
      faultShow: false,
      thresholdType: [
        { value: 1, label: '上下限' },
        { value: 2, label: '区间' },
        { value: 3, label: '基准值上下限' },
        { value: 4, label: '基准值区间' },
        { value: 5, label: '等值' }
      ],
      unit: '', // 计量单位
      form: {
        moThType: 1, // 阈值类型
        moThBase: '', // 基准值
        moThUp: '', // 上限值
        moThDown: '', // 下限值
        moThInupdown: 0, // 是否包含上下限 1包含0不包含 默认0
        moThValue: '', // 对比值
        moThPriority: 100, // 优先级
        resMtypeName: '',
        moAbnormalName: '',
        moKpiId: '', // 指标id
        resStypeId: '', // 子类型id
        moAbnormalId: '', // 故障id
        moThId: '' // 阈值规则id
      },
      rules: {
        moKpiId: [
          { required: true, type: 'number', message: '请选择指标', trigger: 'change' }
        ],
        moAbnormalId: [
          { required: true, type: 'number', message: '请选择告警信息', trigger: 'change' }
        ],
        moThPriority: [
          { required: true, type: 'number', message: '请输入正确的优先级数字', trigger: 'blur' }
        ],
        moThValue: [
          { validator: moThValue, trigger: 'blur' }
        ],
        moThUp: [
          { validator: moThUp, trigger: 'blur' }
        ],
        moThBase: [
          { validator: moThBase, trigger: 'blur' }
        ],
        moThDown: [
          { validator: moThDown, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    targetKpiData () {
      if (!this.targetKpiData.resStypeId) return
      this.form.resStypeId = this.targetKpiData.resStypeId
      this.form.moKpiId = this.targetKpiData.moKpiId
      this.unit = this.targetKpiData.unitEn || this.targetKpiData.unitCh
      this.form.resMtypeName = this.targetKpiData.resStypeName
    },
    faultData () {
      if (!this.faultData.moAbnormalId) return
      this.form.moAbnormalId = this.faultData.moAbnormalId
      this.form.moAbnormalName = this.faultData.moAbnormalName
    },

    formData: {
      handler () {
        if (this.formData.type !== 2) return
        _.forIn(this.form, (val, key) => {
          this.form[key] = _.get(this.formData.info, key, '')
        })
        this.targetKpiData = {
          'resMtypeName': this.formData.info.resMtypeName,
          'resStypeName': this.formData.info.resStypeName,
          'moKpiName': this.formData.info.moKpiName
        }
        this.faultData = {
          'moAbnormalName': this.formData.info.moAbnormalName
        }
        this.unit = this.formData.info.unitCh || this.formData.info.unitEn
      },
      deep: true
    }
  },
  methods: {
    typeChange (value) {
      switch (value) {
        case 5:
          this.form.moThBase = ''
          this.form.moThUp = ''
          this.form.moThDown = ''
          break
        case 3:
        case 4:
          this.form.moThValue = ''
          break
        case 1:
        case 2:
          this.form.moThBase = ''
          this.form.moThValue = ''
          break
        default:
          break
      }
    },
    ok () {
      this.$refs.form.validate((valid) => {
        if (!valid) return ''
        this.formData.callback(this.form)
      })
    },
    clear () {
      setTimeout(() => {
        this.form = {
          moThType: 1, // 阈值类型
          moThBase: '', // 基准值
          moThUp: '', // 上限值
          moThDown: '', // 下限值
          moThInupdown: 0, // 是否包含上下限 1包含0不包含 默认0
          moThValue: '', // 对比值
          moThPriority: 100, // 优先级
          resMtypeName: '',
          moAbnormalName: '',
          moKpiId: '', // 指标id
          resStypeId: '', // 子类型id
          moAbnormalId: '', // 故障id
          moThId: '' // 阈值规则id
        }
        this.targetKpiData = {} // 选择的指标kpi
        this.faultData = {} // 选择的故障定义数据
        this.unit = ''
        this.$refs.form.resetFields()
        this.$refs.target.clear()
      }, 300)
    },
    cancel () {
      this.formData.show = false
      this.clear()
    },
    selectFault (data) {
      this.faultShow = false
      if (data.handle === 'cancel') return
      this.faultData = data.array[0]
    },
    selectTarget (e) {
      this.targetShow = false
      if (e.handle === 'cancel') return
      this.targetKpiData = e.data
    }
  }
}
</script>
