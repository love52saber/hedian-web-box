<style lang="less">
.m_content_box_target {
  border: 1px #f1f1f1 solid;
  border-radius: 5px;
  .u_tip {
    color: #cccccc;
    padding: 0 10px;
    margin-top: 5px;
    display: block;
  }
  .m_main_type,
  .m_target_type {
    list-style: none;
    height: 250px;
    overflow: auto;
    li {
      height: 33px;
      line-height: 33px;
      cursor: pointer;
      padding: 0 30px;
      .u_type_icon,
      .u_target_icon {
        line-height: 33px;
      }
      &:hover {
        background-color: #eee;
      }
    }
  }
  .m_tree {
    height: 250px;
    margin-left: 10px;
    overflow: auto;
    .ivu-tree-title.active {
      background: #03bcb7;
      color: #fff;
      border-radius: 0;
    }
  }
}
.tip {
  padding: 10px 20px 5px;
  color: #b5b3b3;
  .active {
    color: #03bcb7;
    font-weight: 800;
  }
}
</style>

<template>
  <Modal :z-index="1002" v-model="show" title='选择监控指标' :closable="false" :mask-closable="false" width='700'>
    <Row :gutter="32" justify="center">
      <i-col class="mb10" :span="8">
        <div class="m_content_box_target">
          <span class='u_tip'>请选择资源主类型</span>
          <ul class="m_main_type">
            <li v-for="(item, index) in mainType" :key="index" @click.stop="selectMainType(item, $event)">
              <span v-text="item.resMtypeName"></span>
              <Icon class="u_type_icon fr" v-show="resMtype === item.resMtypeId" color="#04bbb7" size="18" type="md-checkmark-circle"></Icon>
            </li>
          </ul>
        </div>
      </i-col>
      <i-col class="mb10" :span="8">
        <div class="m_content_box_target">
          <span class='u_tip'>请选择资源子类型</span>
          <Tree class='m_tree' :data='tree'></Tree>
        </div>
      </i-col>
      <i-col class="mb10" :span="8">
        <div class="m_content_box_target">
          <span class='u_tip'>请选择指标</span>
          <ul class="m_target_type">
            <li v-for="(item, index) in kpiList" :key="index" @click='selectTarget(item, $event)'>
              {{item.moKpiName}} {{item.unitCh? '/':''}} {{item.unitCh}}
              <Icon class="u_target_icon" v-show="false" style="float:right;" color="#04bbb7" size="18" type="md-checkmark-circle"></Icon>
            </li>
          </ul>
        </div>
      </i-col>
    </Row>
    <div class="tip">当前选择：资源主类型
      <span class='active' v-text="mainName"></span> ；资源子类型
      <span class="active" v-text="subName"></span> ；指标
      <span class="active" v-text="targetName"></span>
    </div>
    <div slot="footer" class="m_footer">
      <Button @click="ok" class="u_btn u_btn_ok" type="info" size="large">确定</Button>
      <Button @click="cancel" class="u_btn" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Target',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      resMtype: '', // 主类型id
      resStype: '', // 子类型id
      mainName: '',
      subName: '',
      targetName: '',
      sendData: {}
    }
  },
  computed: {
    ...mapState({
      mainTypeList: state => state.device.mainTypeList,
      kpiList: state => state.device.kpiInCtrl,
      subTypeList: state => state.device.subTypeList
    }),
    mainType () {
      if (this.mainTypeList.length === 0) return []
      this.resMtype = this.mainTypeList[0].resMtypeId
      this.mainName = this.mainTypeList[0].resMtypeName
      return this.mainTypeList
    },
    tree () {
      let menuTree = []
      if (this.subTypeList && this.subTypeList.length) {
        this.subTypeList.forEach((item, index) => {
          if (!index) {
            this.resStype = item.resStypeId
            this.subName = item.resStypeName
          }
          menuTree.push(this.makeTree(item))
        })
      }
      return menuTree
    }
  },
  watch: {
    resMtype (current, prev) {
      if (!current) return
      this.getSubTypeList(current)
    },
    resStype (current, prev) {
      if (!current) return
      this.kpiInCtrl(current)
    }
  },
  methods: {
    ...mapActions([
      'getSubTypeList',
      'kpiInCtrl'
    ]),
    selectMainType (data, $event) {
      [...document.querySelectorAll('.u_type_icon')].forEach(item => { item.style.display = 'none' })
      $event.target.querySelector('.u_type_icon ').style.display = ''
      this.mainName = data.resMtypeName
      this.resMtype = data.resMtypeId;
      // 清空掉指标状态
      [...document.querySelectorAll('.u_target_icon')].forEach(item => { item.style.display = 'none' })
      this.targetName = data.moKpiName
      this.targetId = data.moKpiId
    },
    selectTarget (data, $event) {
      [...document.querySelectorAll('.u_target_icon')].forEach(item => { item.style.display = 'none' })
      $event.target.querySelector('.u_target_icon ').style.display = ''
      this.targetName = data.moKpiName
      this.targetId = data.moKpiId
      this.sendData = data
    },
    ok () {
      if (!this.sendData.moKpiId) return this.$Notice.warning({ title: '请选择指标' })
      this.$emit('callback', {
        handle: 'ok',
        data: {
          resStypeId: this.resStype,
          ...this.sendData,
          resMtypeName: this.mainName,
          resStypeName: this.subName
        }
      })
    },
    cancel () {
      this.$emit('callback', {
        handle: 'cancel'
      })
      this.clear()
    },
    clear () {
      setTimeout(() => {
        this.sendData = {}
        this.targetName = '';
        [...document.querySelectorAll('.u_target_icon')].forEach(item => { item.style.display = 'none' }) // 重置指标状态
      }, 500)
    },
    makeTree (node) {
      let n = {
        id: node.resStypeId,
        title: node.resStypeName,
        expand: true,
        render: this.render,
        children: []
      }
      if (node.children) {
        node.children.forEach(e => {
          n.children.push(this.makeTree(e))
        })
      }
      return n
    },
    render (h, { root, node, data }) {
      if (data.nodeKey === 0) {
        this.resStype = data.id
      }
      return h('span', {
        class: data.nodeKey === 0 ? 'ivu-tree-title active' : 'ivu-tree-title',
        on: {
          click: e => {
            [...document.querySelectorAll('.ivu-tree-title')].forEach(item =>
              item.classList.remove('active')
            )
            e.currentTarget.classList.add('active');
            [...document.querySelectorAll('.u_target_icon')].forEach(item => { item.style.display = 'none' })
            this.targetName = data.moKpiName
            this.targetId = data.moKpiId
          }
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'folder',
              size: 18
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ])
      ])
    }
  }
}
</script>
