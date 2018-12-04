<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" class="big" key="max-logo" />
          <p v-show="!collapsed" v-text="appName" class="u_app_name"></p>
          <img v-show="collapsed" :src="minLogo" class="small" title="版权©南京和电科技有限公司" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-name="username" :user-avator="userAvator" />
          <notice :todo-number="0" :warning-number="warningNumber" :msg-number="0" />
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Notice from './components/notice'
import { mapMutations, mapActions, mapState } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/hedian.png'
import maxLogo from '@/assets/images/logo.png'
import './main.less'
import bus from '@/libs/bus'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    Fullscreen,
    User,
    Notice
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      webSocket: null
    }
  },
  created () {
    this.initWebSocket()
    this.getRealTimeAlarmList()
  },
  beforeDestroy () {
    this.closeWebSocket()
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId,
      warningNumber: state => state.abnormal.warningNumber,
      appName: state => state.app.appName
    }),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      const avatar = this.$store.state.user.avatorImgPath
      return avatar ? `${window.config.fileHost}${avatar}` : ''
    },
    username () {
      return this.$store.state.user.username
    },
    cacheList () {
      return ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute'
    ]),
    ...mapActions([
      'getRealTimeAlarmList'
    ]),
    initWebSocket () {
      if (!this.userId) return
      const wsUrl = window.config.wsUrl + this.userId
      this.webSocket = new WebSocket(wsUrl)
      this.webSocket.onmessage = this.onMessage
      this.webSocket.onopen = this.onOpen
      this.webSocket.onclose = this.onClose
    },
    onMessage (e) {
      console.log('收到ws消息 = ', e)
      const type = JSON.parse(e.data).type
      switch (type) {
        case 1: // 告警类通知， 刷新告警状态
          console.log('告警类通知')
          bus.$emit('shouldUpdatePage')
          break
        case 2:

          break
        case 3:

          break
        default:
          break
      }
    },
    onClose (e) {
      console.log('关闭ws链接 (' + e.code + ')')
      this.reconnect()
    },
    onOpen (e) {
      console.log('创建ws链接 :', JSON.stringify(e))
    },
    closeWebSocket () {
      if (!this.webSocket) return
      this.webSocket.close()
    },
    reconnect () { // 30s断线重连
      setTimeout(() => {
        if (window.location.href.indexOf('login') !== -1) return // 如果是在登录页，就不重新连接了，说来也奇怪，明明在destory前销毁了ws实例，但还是要重新连接，想不通
        this.initWebSocket()
      }, 30000)
    },
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(window.config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: window.config.homeName
      })
    }

    // const elem = document.querySelector('.content-wrapper')
    // const bodyHeight = document.body.offsetHeight
    // const headerAndNavHeight = 104
    // elem.style.height = `${bodyHeight - headerAndNavHeight}px`
    // console.log(elem, bodyHeight)
  }
}
</script>
