<style lang='less' scoped>
.ivu-form-item {
  .tree_container {
    border: 1px #eee solid;
    padding-left: 20px;
    height: 300px;
    overflow: auto;
    .ivu-tree {
      line-height: 20px;
    }
  }
}
</style>
<template>
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false">
    <Form :model='form' :rules="rules" ref="form" style="padding-right: 30px" :label-width='100'>
      <FormItem prop="roleName" label="角色名称：">
        <Input v-model="form.roleName" :readonly="formData.type === 0" placeholder="输入角色名称" :maxlength="20" />
      </FormItem>
      <FormItem label="备注：">
        <Input v-model="form.remark" :readonly="formData.type === 0" placeholder="输入备注" :maxlength="20" />
      </FormItem>
      <FormItem label="权限：">
        <div class="tree_container">
          <Tree @on-check-change="checked" :data="departmentTree" show-checkbox></Tree>
        </div>
      </FormItem>
    </Form>
    <div class="m_footer" slot="footer">
      <Button class="u_btn u_btn_add" @click="ok" type="info" size="large">确定</Button>
      <Button class="u_btn" v-if="formData.type !== 0" @click="cancel" type="default" size="large">取消</Button>
    </div>
  </Modal>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'RoleForm',
  props: {
    formData: {
      type: Object,
      required: true
    },
    menu: {
      type: Array,
      required: true
    }
  },
  computed: {
    departmentTree () {
      let menuTree = []
      if (this.menu && this.menu.length) {
        this.menu.forEach((item) => {
          menuTree.push(this.makeTree(item))
        })
      }
      return menuTree
    }
  },
  mounted () {
    this.$watch('formData', () => {
      _.forIn(this.form, (val, key) => {
        this.form[key] = this.formData.type !== 1 ? this.formData.info[key] : ''
      })
      if (this.formData.type === 2) this.menuIds = this.formData.info.menuIds
    }, { deep: true })
  },
  data () {
    return {
      form: {
        roleName: '',
        remark: ''
      },
      menuIds: [],
      rules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    checked (e) {
      this.menuIds = []
      e.forEach(item => {
        this.menuIds.push(item.id)
      })
    },
    ok () {
      if (this.formData.type === 0) {
        this.formData.show = false
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.formData.callback({
            ...this.form,
            menuIds: this.menuIds,
            roleId: this.formData.type === 2 ? this.formData.info.roleId : null
          })
        }
      })
    },
    cancel () {
      this.formData.show = false
      this.clear()
    },
    clear () {
      setTimeout(() => {
        this.form = {
          roleName: '',
          remark: ''
        }
        this.menuIds = []
        this.$refs['form'].resetFields()
      }, 0)
    },
    handleReset () {
      this.$refs['form'].resetFields()
    },
    makeTree (node) {
      let n = {
        id: node.menuId,
        title: node.name,
        expand: true,
        render: this.renderDepartmentNode,
        checked: this.formData.info.menuIds && this.formData.info.menuIds.findIndex(item => item === node.menuId) !== -1,
        disabled: this.formData.type === 0,
        children: []
      }
      if (node.childMenu) {
        node.childMenu.forEach(e => {
          n.children.push(this.makeTree(e))
        })
      }
      return n
    },
    renderDepartmentNode (h, { root, node, data }) {
      return h(
        'span',
        {
          class: 'ivu-tree-title',
          on: {
            click: (e) => {
              [...document.querySelectorAll('.ivu-tree-title')].forEach(item => item.classList.remove('active'))
              e.currentTarget.classList.add('active')
            }
          }
        },
        [
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
        ]
      )
    }
  }
}
</script>
