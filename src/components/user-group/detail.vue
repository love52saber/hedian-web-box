<style lang='less'>
.m_member_list {
  list-style: none;
  li.u_member_item {
    display: inline-block;
    width: 50%;
  }
}
</style>

<template>
  <Modal v-model='data.show' title='用户组基本信息' :closable="false" :mask-closable="false">
    <Form :label-width='120'>
      <FormItem class="mb10" label="用户组名称：">
        <span v-text="info.grpName"></span>
      </FormItem>
      <FormItem class="mb10" label="用户组类型：">
        <RadioGroup v-model='info.grpType'>
          <Radio disabled :label="1">普通用户组</Radio>
          <Radio disabled :label="2">工单处理组</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem class="mb10" label="角色：">
        <CheckboxGroup v-model='info.roleIds'>
          <Tooltip :content="item.roleName" placement="top-start" v-for="(item, index) in roleList" :key="index">
            <Checkbox disabled :label="item.roleId">{{item.roleName}}</Checkbox>
          </Tooltip>
        </CheckboxGroup>
      </FormItem>
      <FormItem class="mb10" label="描述：">
        <span v-text="info.grpDesc"></span>
      </FormItem>
      <FormItem class="mb10" label="成员：">
        <ul class="m_member_list">
          <li v-for="item in member" :key="item.userId+'member'" class="u_member_item">
            {{item.name}} {{item.username}}
          </li>
        </ul>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer" style="">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="data.show = false">关闭</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'UserGroupDetail',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      roleList: state => state.user.allRoleList,
      userList: state => state.user.userList
    }),
    info () {
      return this.data.data
    },
    member () {
      const member = []
      if (!this.info.userIds) return member
      this.info.userIds.forEach(item => {
        const isInMember = member.findIndex(u => u.userId === item) !== -1
        if (!isInMember) member.push(this.userList.find(u => u.userId === item))
      })
      return member
    }
  }
}
</script>
