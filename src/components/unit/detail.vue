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
  <Modal v-model='data.show' title='组织机构详情' :closable="false" :mask-closable="false">
    <Form style="width:80%;margin: 0 auto;" :label-width='120'>
      <FormItem label='上级组织机构：'>
        <span v-text="info.parentName ? info.parentName : '无'"></span>
      </FormItem>
      <FormItem label='组织机构全称：'>
        <span v-text="info.name"></span>
      </FormItem>
      <FormItem label='组织机构简称：'>
        <span v-text="info.shortName"></span>
      </FormItem>
      <FormItem label='机构编码：'>
        <span v-text="info.orgCode"></span>
      </FormItem>
      <FormItem label='组织类型：'>
        <span v-text="info.orgType === 1 ? '本单位':'合作单位'"></span>
      </FormItem>
      <FormItem label='部门介绍：'>
        <span v-text="info.orgDesc"></span>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer" style="">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="data.show = false">关闭</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: 'UnitDetail',
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
