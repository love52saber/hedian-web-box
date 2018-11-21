<style lang="less">
.g_unit_container {
  padding: 15px;
  width: 100%;
  height: 100%;
  .m_unit_content {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 3px 5px #eee;
    overflow: auto;
    .m_unit_header {
      height: 36px;
      line-height: 36px;
      .u_btn {
        position: relative;
        width: 80px;
        &.u_add_btn {
          float: right;
          top: -36px;
          margin-right: 30px;
          background: #04bbb7;
          border-color: #04bbb7;
        }
      }
    }
  }
}
</style>
<template>
  <div class="g_unit_container">
    <Card class="m_unit_content" shadow bordered>
      <div class="m_unit_header" slot="title">
        <h3>组织单位管理</h3>
        <Button class="u_btn u_add_btn" type="info" size='large' long> 添加 </Button>
      </div>
      <tree-grid :columns='columns' :items='unitList' />
    </Card>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import TreeGrid from '_c/unit/treeGrid.vue'
export default {
  name: 'Unit',
  components: {
    TreeGrid
  },
  data () {
    return {
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
              type: 'md-eye',
              text: '查看',
              size: '22',
              style: {
                marginRight: '20px',
                cursor: 'pointer'
              }
            },
            {
              type: 'md-create',
              text: '编辑',
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
              type: 'md-trash',
              text: '删除',
              style: {
                marginRight: '20px',
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
      unitList: state => state.user.organizationalUnit
    })
  },
  methods: {
    ...mapActions([
      'getOrganizationalUnit'
    ])
  }
}
</script>
