<template>
  <div class="g_unit_container">
    <Card class="m_unit_content" shadow bordered>
      <div class="m_unit_header" slot="title">
        <h3>组织单位管理</h3>
        <Button class="u_btn u_add_btn" @click="handleAddBtnClick" type="info" size='large' long> 添加 </Button>
      </div>
      <tree-grid :columns='columns' :items='unitList' @on-row-click='actions' />
    </Card>
    <confirm :show="showConfirmModal" :action="confirm.action" :operator="confirm.operator" :on-ok="confirm.callback" />
    <unit-form :form-data="formData" />
    <unit-detail :data="detail" />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import TreeGrid from '_c/unit/treeGrid.vue'
import { Confirm } from '_c/controls'
import UnitForm from '_c/unit/form.vue'
import UnitDetail from '_c/unit/detail.vue'
import './unit.less'
export default {
  name: 'Unit',
  components: {
    TreeGrid,
    Confirm,
    UnitForm,
    UnitDetail
  },
  data () {
    return {
      confirm: {
        operator: '',
        action: '',
        callback: this.delete
      },
      willbeDeletedId: '',
      formData: { // 表单数据
        action: '组织机构新增',
        show: false,
        callback: null,
        parentName: '',
        parentId: 0, // 默认根节点的
        deptId: null, // 修改有用，新增无用
        deptInfo: null
      },
      detail: {
        show: false,
        data: {}
      },
      columns: [
        {
          title: '组织机构全称',
          key: 'name',
          width: 250
        },
        {
          title: '组织机构简称',
          key: 'shortName'
        },
        {
          title: '组织结构编码',
          key: 'orgCode'
        },
        {
          title: '组织类型',
          key: 'orgType',
          width: 100
        },
        {
          title: '部门介绍',
          key: 'orgDesc',
          width: 50
        },
        {
          width: 180,
          title: '操作',
          type: 'action',
          align: 'center',
          actions: [
            {
              type: window.config.DETAIL_ICON,
              text: '查看',
              size: '22',
              style: {
                marginRight: '20px',
                cursor: 'pointer'
              }
            },
            {
              type: window.config.UPDATE_ICON,
              text: '修改',
              style: {
                marginRight: '20px',
                cursor: 'pointer'
              }
            },
            {
              type: 'md-add-circle',
              text: '新增',
              style: {
                marginRight: '20px',
                cursor: 'pointer'
              }
            },
            {
              type: window.config.DELETE_ICON,
              text: '删除',
              style: {
                cursor: 'pointer'
              }
            }
          ]
        }
      ]
    }
  },
  created () {
    this.getOrganizationalUnit()
  },
  computed: {
    ...mapState({
      unitList: state => state.user.organizationalUnit,
      showConfirmModal: state => state.app.showConfirmModal
    })
  },
  methods: {
    ...mapActions([
      'getOrganizationalUnit',
      'addUnit',
      'updateUnit',
      'deleteUnit'
    ]),
    ...mapMutations(['setShowConfirmModal']),
    add (params) {
      this.addUnit(params).then(res => {
        if (res.msg !== 'success') return this.$Notice.error({ title: res.msg })
        this.$Notice.success({ title: '创建成功' })
        this.formData.show = false
        this.getOrganizationalUnit()
      })
    },
    handleAddBtnClick () {
      this.formData.action = '组织机构新增'
      this.formData.callback = this.add
      this.formData.parentName = ''
      this.formData.parentId = 0
      this.formData.show = true
    },
    update (params) {
      this.updateUnit(params).then(res => {
        if (res.msg !== 'success') return this.$Notice.error({ title: res.msg })
        this.$Notice.success({ title: '修改成功' })
        this.formData.show = false
        this.getOrganizationalUnit()
      })
    },
    delete () {
      this.deleteUnit(this.willbeDeletedId).then(res => {
        if (res.msg !== 'success') return this.$Notice.error({ title: res.msg })
        this.$Notice.success({ title: '删除成功' })
        this.setShowConfirmModal(false)
        this.getOrganizationalUnit()
      })
    },
    actions (data, e, index, btnName) {
      switch (btnName) {
        case '查看':
          this.detail.data = data
          this.detail.show = true
          break
        case '修改':
          this.formData.parentId = null
          this.formData.deptId = data.deptId + ''
          this.formData.parentName = data.parentName
          this.formData.action = '组织机构修改'
          this.formData.callback = this.update
          this.formData.deptInfo = data
          this.formData.show = true
          break
        case '新增':
          this.formData.action = '组织机构新增'
          this.formData.parentId = data.deptId
          this.formData.parentName = data.name
          this.formData.deptInfo = null
          this.formData.callback = this.add
          this.formData.deptId = null
          this.formData.show = true
          break
        case '删除':
          if (!data.delflag) return this.$Notice.error({ title: `${data.name}不可被删除` })
          this.confirm.operator = data.name
          this.confirm.action = '删除'
          this.confirm.callback = this.delete
          this.willbeDeletedId = data.deptId
          this.setShowConfirmModal(true)
          break
        default:
          break
      }
    }
  }
}
</script>
