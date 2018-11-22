<template>
  <Modal v-model='data.show' title='用户基本信息' :closable="false" :mask-closable="false">
    <Form style="width:70%;margin: 0 auto;" :label-width='120'>
      <div class="mb10" style="text-align:center;">
        <Avatar :src="avatar" size='large' icon="ios-person" />
      </div>
      <FormItem class="mb10" label="姓名：">
        <span v-text="info.name"></span>
      </FormItem>
      <FormItem class="mb10" label="性别：">
        <RadioGroup v-model='info.sex'>
          <Radio disabled :label="1">男</Radio>
          <Radio disabled :label="2">女</Radio>
          <Radio disabled :label="0">未知</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem class="mb10" label="部门：">
        <span v-text="info.sysDept ? info.sysDept.name: ''"></span>
      </FormItem>
      <FormItem class="mb10" label="手机号：">
        <span v-text="info.mobile"></span>
      </FormItem>
      <FormItem class="mb10" label="固定电话：">
        <span v-text="info.telephone"></span>
      </FormItem>
      <FormItem class="mb10" label="邮箱：">
        <span v-text="info.email"></span>
      </FormItem>
      <FormItem class="mb10" label="状态：">
        <RadioGroup v-model='info.status'>
          <Radio disabled :label="0">禁用</Radio>
          <Radio disabled :label="1">正常</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem class="mb10" label="角色：">
        <CheckboxGroup v-model="info.roleIds">
          <Tooltip :content="item.roleName" placement="top-start" v-for="(item, index) in roleList" :key="index">
            <Checkbox disabled :label="item.roleId">{{item.roleName}}</Checkbox>
          </Tooltip>
        </CheckboxGroup>
      </FormItem>
      <FormItem class="mb10" label="解锁时间：">
        <span v-text="info.unlocktime ? info.unlocktime : '无'"></span>
      </FormItem>
      <FormItem class="mb10" label="锁定原因：">
        <span v-text="info.unlockreason ? info.unlockreason : '无'"></span>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer" style="">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="data.show = false">关闭</Button>
    </div>
  </Modal>
</template>
<script>
import _ from 'lodash'
import config from '@/config'
import { mapState } from 'vuex'
export default {
  name: 'UserDetail',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      roleList: state => state.user.allRoleList
    }),
    info () {
      return this.data.data
    },
    avatar () {
      const url = _.get(this.info, 'sysFile.url', '')
      return url ? `${config.fileHost}${url}` : ''
    }
  }
}
</script>
