<style lang="less">
.m_footer {
  text-align: center;
  .u_btn {
    width: 100px;
    &.u_btn_ok {
      background: #04bbb7;
    }
  }
}
</style>

<template>
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false" @on-ok='ok("form")' @on-cancel='cancel("form")'>
    <Form style="width:80%;margin: 0 auto;" ref='form' :rules='rules' :model='formItem' :label-width='100'>
      <FormItem label='上级组织机构'>
        <Input v-model='formData.parentName' disabled placeholder='无' :maxlength=20 />
      </FormItem>
      <FormItem label='组织机构全称' required prop='name'>
        <Input v-model='formItem.name' placeholder='输入组织机构全称' :maxlength=20 />
      </FormItem>
      <FormItem required prop='shortName' label='组织机构简称'>
        <Input v-model='formItem.shortName' placeholder='输入组织机构简称' :maxlength=20 />
      </FormItem>
      <FormItem label='机构编码'>
        <Input v-model='formItem.orgCode' placeholder='输入机构编码' :maxlength=20 />
      </FormItem>
      <FormItem required prop='orgType' label='组织类型'>
        <Select v-model='formItem.orgType'>
          <Option :value='1'>本单位</Option>
          <Option :value='2'>合作单位</Option>
        </Select>
      </FormItem>
      <FormItem label='部门介绍'>
        <Input v-model='formItem.orgDesc' type='textarea' :maxlength=200 :autosize='{minRows: 2,maxRows: 5}' placeholder='输入部门介绍' />
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer" style="">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="ok('form')">确定</Button>
      <Button class="u_btn" type="default" size="large" @click="cancel('form')">取消</Button>
    </div>
  </Modal>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'UnitForm',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('组织机构全称不能为空'))
      } else {
        callback()
      }
    }
    const validateShortName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('组织机构简称不能为空'))
      } else {
        callback()
      }
    }
    const validateOrderNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('显示顺序不能为空'))
      } else if (_.isNaN(Number(value))) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    const validateOrgType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('组织类型不能为空'))
      } else {
        callback()
      }
    }
    return {
      formItem: {
        name: '',
        shortName: '',
        orgCode: '',
        orderNum: 100,
        orgType: '',
        orgDesc: ''
      },
      rules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        shortName: [{ validator: validateShortName, trigger: 'blur' }],
        orderNum: [{ validator: validateOrderNum, trigger: 'blur' }],
        orgType: [{ validator: validateOrgType, trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.$watch('formData', () => {
      if (!this.formData.deptInfo) return
      _.forIn(this.formItem, (val, key) => {
        this.formItem[key] = this.formData.deptInfo[key]
      })
    }, { deep: true })
  },
  methods: {
    ok (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formData.callback({
            ...this.formItem,
            parentId: this.formData.parentId,
            deptId: this.formData.deptId
          })
          this.clear(name)
        }
      })
    },
    clear (name) {
      this.$refs[name].resetFields()
      setTimeout(() => {
        this.formItem = {
          name: '',
          shortName: '',
          orgCode: '',
          orderNum: 100,
          orgType: '1',
          orgDesc: ''
        }
      }, 1000)
    },
    cancel (name) {
      this.formData.show = false
      this.clear(name)
    }
  }
}
</script>
