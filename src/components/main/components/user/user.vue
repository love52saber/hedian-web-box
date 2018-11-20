<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <DropdownMenu slot="list">
        <DropdownItem name="userInfo">基本资料</DropdownItem>
        <DropdownItem name="password">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
      <Badge :dot="!!messageUnreadCount">
        <Avatar icon='ios-person' :src="userAvator" />
        {{userName}}
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
    </Dropdown>
    <update-user :user-avator="userAvator" />
    <update-password />
  </div>
</template>

<script>
import './user.less'
import UpdateUser from './updateUser.vue'
import UpdatePassword from './updatePassword.vue'
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'User',
  components: {
    UpdateUser,
    UpdatePassword
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    },
    userName: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    ...mapMutations([
      'setShowUpdateUserInfoModal',
      'setShowUpdatePasswordModal'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'userInfo':
          this.setShowUpdateUserInfoModal(true)
          break
        case 'password':
          this.setShowUpdatePasswordModal(true)
          break
        default:
          break
      }
    }
  }
}
</script>
