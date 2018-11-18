<style lang="less">
</style>
<template>
  <div>
    <info-card title="搜索">
      搜索条件

    </info-card>
    <info-card :has-header="false">
      这里是设备树的内容
    </info-card>
  </div>

</template>
<script>
import InfoCard from '_c/card'
import _ from 'lodash'
export default {
  name: 'deviceTree',
  components: {
    InfoCard
  },
  props: {
    deviceList: {
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
  methods: {
    filter (item) {
      if (item.children && item.children.length) {
        item.children = item.children.filter(this.filter)
        return true
      } else if (item.title && item.status && item.level) {
        return (item.title.indexOf(this.form.name) > -1 && item.status.indexOf(this.form.status) > -1 && item.level.indexOf(this.form.level) > -1)
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
          e.radius = 6
          e.iconSize = [20, 20]
          e.iconAnchor = [10, 10]
          e.selected = false
          const list = this.$store.state.device.deviceList
          const index = list.findIndex(item => item.resId === e.resId)
          if (index !== -1) { // 若存在设备列表里则先删除再push最新的状态进入list
            list.splice(index, 1)
          }
          this.$store.commit('pushDeviceList', e)
          return {
            id: e.resId,
            title: e.resAlias || e.resName, // 优先显示别名
            render: this.renderDeviceNode,
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
          click: (e) => { // 左键选中
            [...document.querySelectorAll('.u_device_item')].forEach(item => {
              item.classList.remove('active')
            })
            e.currentTarget.classList.add('active')
            bus.$emit('changeMapCenter', data.id)
          },
          contextmenu: (e) => { // 显示右键菜单
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
    showDetail () {
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
