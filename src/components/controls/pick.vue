<style lang="less">
.g_pick_person_container {
  ul {
    list-style: none;
  }
  .m_title {
    display: block;
    width: 80%;
    margin-left: 10%;
    margin-bottom: 15px;
    padding-bottom: 10px;
    color: #ccc;
    font-size: 14px;
    font-weight: bolder;
    line-height: 20px;
    border-bottom: 1px #ebeff8 solid;
  }
  .m_group_container {
    width: 80%;
    margin-left: 20%;
    padding-right: 10%;
    height: 300px;
    overflow: auto;
    border-right: 1px #ebeff8 solid;
    border-left: 1px #ebeff8 solid;
    .m_group_item {
      padding: 0 10px;
      margin-bottom: 5px;
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      &:hover {
        background: #04bbb7;
        color: #fff;
        cursor: pointer;
      }
    }
    .m_group_item.active {
      background: #04bbb7;
      color: #fff;
      cursor: pointer;
    }
  }
  .m_user_container {
    width: 80%;
    margin-right: 20%;
    padding-left: 10%;
    height: 300px;
    overflow: auto;
    border-right: 1px #ebeff8 solid;
    .m_user_item {
      display: block;
      margin-bottom: 12px;
      .u_username {
        display: inline-block;
        width: 70%;
      }
    }
  }
}
</style>
<template>
  <Modal :z-index="1002" v-model='show' :width='700' class-name="my-modal" class="g_pick_person_container" :closable="false" :mask-closable="false" title='提交'>
    <span class="m_title">请选择下一节点处理人</span>
    <Row>
      <Col span="12">
      <ul class="m_group_container">
        <li class="m_group_item" v-if="wfGroup.length === 0">没有工单组</li>
        <li class="m_group_item" @click="groupClick(item.grpId, $event)" :class="{ active: index === 0 }" v-for="(item, index) in wfGroup" :key="item.grpId">{{item.grpName}}</li>
      </ul>
      </Col>
      <Col span="12">
      <ul class="m_user_container">
        <div v-if="wfPerson.length === 0">没有用户</div>
        <RadioGroup v-model="currentUser" v-if="wfPerson.length !== 0">
          <Radio class="m_user_item" v-for="item in wfPerson" :key="item.username" :label="item.userId">
            <span class="u_username">{{item.name}}</span>
            {{item.username}}
          </Radio>
        </RadioGroup>
      </ul>
      </Col>
    </Row>
    <div slot="footer" style="text-align:center;">
      <Button style="background:#04bbb7;width:100px" type="info" size="large" @click="ok">确定</Button>
      <Button style="width:100px" type="default" size="large" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
import bus from '@/libs/bus'
export default {
  name: 'PickPerson',
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    type: { // 定义如何调用，创建的时候调用还是列表处理的时候调用， create/workflow
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      grpId: '',
      currentUser: ''
    }
  },
  watch: {
    grpId () {
      this.$store.dispatch('getWfPeople', this.grpId)
    }
  },
  created () {
    this.$store.dispatch('getWfGroup')
  },
  computed: {
    wfGroup () {
      if (this.$store.state.order.wfGroup.length) {
        this.grpId = this.$store.state.order.wfGroup[0].grpId
      }
      return this.$store.state.order.wfGroup
    },
    wfPerson () {
      if (this.$store.state.order.wfPerson.length) {
        this.currentUser = this.$store.state.order.wfPerson[0].userId
      }
      return this.$store.state.order.wfPerson
    }
  },
  methods: {
    groupClick (grpId, e) {
      this.grpId = grpId;
      [...document.querySelectorAll('.m_group_item')].forEach(item => {
        item.classList.remove('active')
      })
      e.currentTarget.classList.add('active')
    },
    ok () { // 点击确定按钮
      if (this.currentUser === '') return this.$Notice.warning({ title: '请选择处理人' })
      switch (this.type) {
        case 'create':
          bus.$emit('submitWf', this.currentUser)
          break
        case 'workflow':
          const sub2rew = this.$store.state.order.submitToReview
          this.$store.commit('setSubmitToReview', {
            ...sub2rew,
            currentUser: this.currentUser
          })
          this.$emit('pickCallback', {
            canSubmit: true
          })
          break
        default:
          break
      }
    },
    cancel () { // 点击取消按钮
      switch (this.type) {
        case 'create':
          bus.$emit('submitWf', null)
          break
        case 'workflow':
          this.$store.commit('setSubmitToReview', {})
          this.$emit('pickCallback', {
            canSubmit: false
          })
          break
        default:
          break
      }
    }
  }
}
</script>
