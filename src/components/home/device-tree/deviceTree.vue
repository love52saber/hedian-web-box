<style lang="less">
// 搜索框
.home-search-container {
  box-sizing: border-box;
  // padding: 15px 20px;
  height: 150px;
  .search-item {
    // padding-left: 10px;
    display: flex;
    height: 40px;
    line-height: 40px;
    border-bottom: 3px dotted #24414d;
    margin-bottom: 15px;
    .icon-container {
      width: 30px !important;
      .ivu-icon {
        position: relative;
        top: -5px;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    .icon-container {
      width: 40px;
    }
    .ipt-container {
      flex: 1;
    }
    .ipt {
      display: block;
      height: 30px;
      width: 100%;
      border: none;
      border-left: 2px solid #24414d;
      text-indent: 20px;
      background: none;
      color: #fff;
      &::placeholder,
      &::-webkit-input-placeholder,
      &::-moz-placeholder,
      &:-ms-input-placeholder {
        color: #fff;
      }
      &:focus {
        outline: none;
      }
    }
  }
}
// 设备数
.home-device-tree-container {
  height: 520px;
  box-sizing: border-box;
  // padding: 20px 15px;
  overflow: auto;
  .ivu-tree {
    color: #fff;
    .ivu-tree-title {
      font-size: 13px;
      color: #fff;
      padding: 2px 8px;
      &.active,
      &:hover,
      &.ivu-tree-title-selected {
        color: #fff;
        background: #2d5060;
      }
    }
  }
  .device-status {
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
#menu {
  width: 100px;
  border: 1px solid #3d6d83;
  position: absolute;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  background: #1e343f;
  z-index: 99;
  display: none;
  transition: all 0.1s ease;
  li {
    list-style: none;
    width: 100%;
    color: #fff;
    background: #1e343f;
    &:first-of-type {
      border-radius: 5px 5px 0 0;
    }
    a {
      display: inline-block;
      text-decoration: none;
      color: #fff;
      width: 100%;
      padding: 5px 0;
      text-align: center;
      &:hover,
      &:active {
        background: #eee;
        color: #0aaf88;
      }
    }
  }
}
</style>
<template>
  <div>
    <info-card title="搜索">
      <div class="home-search-container">
        <div class="search-item">
          <div class="icon-container">
            <Icon size="22" color="#fff" type="md-search"></Icon>
          </div>
          <div class="ipt-container">
            <input class="ipt" v-model="form.name" type="text" placeholder="设备名称">
          </div>
        </div>
        <div class="search-item">
          <div class="icon-container">
            <Icon size="22" color="#fff" type="md-list"></Icon>
          </div>
          <div class="ipt-container">
            <input class="ipt" v-model="form.status" type="text" placeholder="设备状态(正常/故障/离线)">
          </div>
        </div>
        <div class="search-item">
          <div class="icon-container">
            <Icon size="22" color="#fff" type="md-build"></Icon>
          </div>
          <div class="ipt-container">
            <input class="ipt" v-model="form.level" type="text" placeholder="故障等级(紧急/重要/次要/提示)">
          </div>
        </div>
      </div>
    </info-card>
    <ul class="menu" id="menu">
      <li><a href="javascript:void(0)" @click="showDetail">详情</a></li>
    </ul>
    <info-card :has-header="false">
      <div class="home-device-tree-container">
        <Tree :data="tree"></Tree>
      </div>
    </info-card>
  </div>

</template>
<script>
import InfoCard from '_c/card'
import _ from 'lodash'
import { mapMutations } from 'vuex'
import bus from '@/libs/bus'
export default {
  name: 'deviceTree',
  components: {
    InfoCard
  },
  props: {
    deviceTree: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      id: null, // 对设备终端右键选择的id
      form: {
        name: '',
        status: '',
        level: ''
      }
    }
  },
  computed: {
    tree () {
      return [this.makeTree(this.deviceTree)].filter(this.filter)
    }
  },
  mounted () {
    this.$watch('form', () => {
      bus.$emit('filter', this.form)
    }, { deep: true })
    // 右键菜单隐藏
    document.addEventListener('click', function () {
      const menu = document.getElementById('menu')
      this.id = null // 恢复null值
      if (menu) menu.style.display = 'none'
    })
  },
  methods: {
    ...mapMutations([
      'setCenter'
    ]),
    filter (item) { // 设备过滤条件函数
      if (item.children && item.children.length) {
        item.children = item.children.filter(this.filter)
        return true
      } else if (item.title && item.status && item.level) {
        return (item.title.indexOf(this.form.name) > -1 && item.status.indexOf(this.form.status) > -1 && item.level.indexOf(this.form.level) > -1)
      } else {
        return true
      }
    },
    makeTree (node) {
      let n = {
        id: node.id,
        title: node.text,
        expand: true,
        children: []
      }
      if (node.attributes) {
        n.children = node.attributes.resBase.map(e => {
          // 为地图打点的数据做装配
          e.radius = 6
          e.iconSize = [20, 20]
          e.iconAnchor = [10, 10]
          e.selected = false
          const list = this.$store.state.device.deviceList
          const index = list.findIndex(item => item.resId === e.resId)
          if (index === -1) { // 若存在设备列表里则不处理
            this.$store.commit('pushDeviceList', e)
          }
          // 装配结束
          return {
            id: e.resId,
            title: e.resAlias || e.resName, // 优先显示别名
            render: this.renderTree,
            color: e.resColor,
            status: _.get(e, 'resStatusDO.resStatusName', '正常'),
            level: _.get(e, 'resAbnormallevel.resAbnormallevelName', '正常')
          }
        })
      }
      if (node.children) {
        node.children.forEach(e => {
          n.children.push(this.makeTree(e))
        })
      }
      return n
    },
    renderTree (h, { root, node, data }) {
      return h('span', {
        class: `ivu-tree-title u_device_item u_res_id_${data.id}`,
        on: {
          click: e => { // 左键选中
            [...document.querySelectorAll('.u_device_item')].forEach(item => {
              item.classList.remove('active')
            })
            e.currentTarget.classList.add('active')
            this.setCenter(data.id) // 将当前设备设置为地图中心点并选中
            bus.$emit('device-tree-click', data.id)
          },
          contextmenu: e => { // 显示右键菜单
            this.id = data.id
            this.showMenu()
            e.preventDefault()
            return false
          }
        }
      }, [h('span', {
        class: 'device-status',
        style: {
          background: data.color || '#04bbb7'
        }
      }),
      h('span', data.title)])
    },
    showMenu (event) { // 显示右键菜单
      const e = event || window.event
      var menu = document.getElementById('menu')
      menu.style.display = 'block'
      var l, t
      l = e.clientX / 3
      t = e.clientY - 120
      if (l >= (this.winWidth() - menu.offsetWidth)) {
        l = this.winWidth() - menu.offsetWidth
      }
      if (t > this.winHeight() - menu.offsetHeight) {
        t = this.winHeight() - menu.offsetHeight
      }
      menu.style.left = l + 'px'
      menu.style.top = t + 'px'
      return false
    },
    showDetail () { // 显示详情
      if (!this.id) return
      this.$emit('tree-select', this.id)
    },
    winWidth () { // 可视区宽
      return document.documentElement.clientWidth || document.body.clientWidth
    },
    winHeight () { // 可视区高
      return document.documentElement.clientHeight || document.body.clientHeight
    }
  }
}
</script>
