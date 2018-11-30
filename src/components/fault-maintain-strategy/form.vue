<template>
  <Modal v-model='formData.show' :title='formData.action' :closable="false" :mask-closable="false" :width='800'>
    <Tabs v-model="defaultTab" type="card">
      <TabPane name="1" label="基本信息">
        <Form ref='form' :rules='rules' :model='form' :label-width='100'>
          <Row :gutter="32">
            <i-col :span="12">
              <FormItem prop="beginTime" label="开始时间：">
                <DatePicker v-model="form.beginTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width:100%" placeholder="请选择开始时间" />
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem prop="endTime" label="结束时间：">
                <DatePicker v-model="form.endTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width:100%" placeholder="请选择结束时间" />
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem prop="fmsName" label="名称：">
                <Input v-model="form.fmsName" placeholder="请输入名称" :maxlength="10"></Input>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="维护单位：">
                <Input readonly v-model="form.deptName" @on-click='deptShow = !deptShow' @on-focus="deptShow = true" placeholder='请选择维护单位' :icon="deptShow ? 'ios-arrow-up' : 'ios-arrow-down'" />
                <div v-show="deptShow" style="border:1px #ccc solid;position:absolute;z-index:999;width:100%;height:200px;background:#fff;overflow:auto">
                  <Tree class='m_tree' :data='tree'></Tree>
                </div>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="维护人：">
                <Select v-model="ids.userId" placeholder="请选择维护人" :not-found-text="deptId === '' ? '请先选择维护单位': '该单位下暂无人员'">
                  <Option v-for="item in userList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem prop="dispatchflag" label="自动派单：">
                <Select v-model="form.dispatchflag">
                  <Option :value="1">是</Option>
                  <Option :value="0">否</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem prop="grpId" label="工单处理组：">
                <Select v-model="form.grpId" placeholder="请选择工单处理组" not-found-text="没有数据">
                  <Option v-for="item in userGroupList" :value="item.grpId" :key="item.grpId">{{ item.grpName }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col :span="24">
              <FormItem prop="fmsStatus" label="状态：">
                <RadioGroup v-model="form.fmsStatus">
                  <Radio :label="1">启用</Radio>
                  <Radio :label="0">禁用</Radio>
                </RadioGroup>
              </FormItem>
            </i-col>
            <i-col :span="24">
              <FormItem label="描述：">
                <Input :maxlength="120" v-model="form.fmsDesc" type="textarea" :rows="2" placeholder="请输入描述，不超过120个字"></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </TabPane>
      <TabPane name="2" label="故障类型">
        <CheckboxGroup v-model="ids.abnormalTypeIds">
          <Row :gutter="32">
            <i-col class="mb10" :span="8" v-for="(item, index) in abnormalType" :key="index">
              <Tooltip :content="item.abnormalTypeName" placement="top-start">
                <Checkbox :label="item.abnormalTypeId">{{item.abnormalTypeName}}</Checkbox>
              </Tooltip>
            </i-col>
          </Row>
        </CheckboxGroup>
      </TabPane>
      <TabPane name="3" label="故障定义">
        <Button type="primary" class="mr10 mb10" @click="faultShow = true">添加</Button>
        <Button type="error" class="mb10" @click="selectDel('abnormalIds')">删除</Button>
        <Table border no-data-text="未选择故障定义" height="335" @on-selection-change="selectChanged('abnormalIds', $event)" :columns="faultColumns" :data="faultData"></Table>
      </TabPane>
      <TabPane name="4" label="管理域">
        <Button type="primary" class="mr10 mb10" @click="domainShow = true">添加</Button>
        <Button type="error" class="mb10" @click="selectDel('mdIds')">删除</Button>
        <Table border no-data-text="未选择维护域" height="335" @on-selection-change="selectChanged('mdIds', $event)" :columns="domainColumns" :data="mdData"></Table>
      </TabPane>
      <TabPane name="5" label="资源信息">
        <Button type="primary" class="mr10 mb10" @click="resourceShow = true">添加</Button>
        <Button type="error" class="mb10" @click="selectDel('resIds')">删除</Button>
        <Table border no-data-text="未选择资源" height="335" @on-selection-change="selectChanged('resIds', $event)" :columns="resourceColumns" :data="resData"></Table>
      </TabPane>
    </Tabs>
    <div class="m_footer" slot="footer">
      <Button class="u_btn u_btn_ok" type="info" size="large" @click="ok">确定</Button>
      <Button class="u_btn" type="default" size="large" @click="cancel">取消</Button>
    </div>
    <fault ref="fault" :pattern='1' :show='faultShow' @callback="faultEmit" />
    <domain ref="domain" :pattern='1' :show="domainShow" @callback="domainEmit" />
    <resource ref="resource" :pattern='1' :show='resourceShow' @callback='resourceEmit' :is-fixed-main-type='false' />
  </Modal>
</template>
<script>
import { Resource, Fault, Domain } from '_c/controls'
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  name: 'FaultMaintainStrategyForm',
  components: {
    Resource,
    Fault,
    Domain
  },
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      resourceShow: false,
      faultShow: false,
      domainShow: false,
      deptShow: false,
      defaultTab: '1',
      faultData: [], // 选择的故障定义数据
      mdData: [], // 选择的维护域数据
      resData: [],
      deptId: '',
      form: { // 表单元素
        showorder: 100,
        fmsName: '',
        grpId: '',
        dispatchflag: '',
        fmsStatus: 1,
        beginTime: '',
        endTime: '',
        fmsDesc: '',
        deptName: '' // 该字段不是后端需要字段,但是需要在页面展示
      },
      ids: { // id集合
        fmsId: '',
        userId: '',
        resIds: [],
        mdIds: [],
        abnormalTypeIds: [],
        abnormalIds: []
      },
      select: { //  用户tab页内批量删除时使用该对象
        abnormalIds: [],
        mdIds: [],
        resIds: []
      },
      rules: {
        fmsName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        dispatchflag: [
          { required: true, type: 'number', message: '派单不能为空', trigger: 'change' }
        ],
        fmsStatus: [
          { required: true, type: 'number', message: '状态不能为空', trigger: 'change' }
        ],
        beginTime: [
          { required: true, type: 'date', message: '开始时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, type: 'date', message: '结束时间不能为空', trigger: 'blur' }
        ],
        grpId: [
          { required: true, type: 'number', message: '工单组不能为空', trigger: 'change' }
        ]
      },
      faultColumns: [
        {
          title: '选择',
          type: 'selection',
          width: 75,
          align: 'center'
        },
        {
          title: '故障编码',
          key: 'moAbnormalcode',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moAbnormalcode
              }
            }, row.moAbnormalcode)
          }
        },
        {
          title: '名称',
          key: 'moAbnormalName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.moAbnormalName
              }
            }, row.moAbnormalName)
          }
        },
        {
          title: '故障类型',
          key: 'abnormalType',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.abnormalType.abnormalTypeName
              }
            }, row.abnormalType.abnormalTypeName)
          }
        },
        {
          title: '级别',
          key: 'resAbnormallevel',
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormallevel.resAbnormallevelName
              }
            }, row.resAbnormallevel.resAbnormallevelName)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 80,
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-trash',
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '删除'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.faultData.splice(this.faultData.findIndex(item => item.moAbnormalId === row.moAbnormalId), 1)
                    this.$refs.fault.toggleSelect(row)
                  }
                }
              })
            ])
          }
        }
      ],
      domainColumns: [
        {
          title: '选择',
          type: 'selection',
          width: 75,
          align: 'center'
        },
        {
          title: '序号',
          key: 'mdId',
          ellipsis: true,
          align: 'center',
          width: 100,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdId
              }
            }, row.mdId)
          }
        },
        {
          title: '名称',
          key: 'mdName',
          ellipsis: true,
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdName
              }
            }, row.mdName)
          }
        },
        {
          title: '描述',
          key: 'mdDesc',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.mdDesc
              }
            }, row.mdDesc)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-trash',
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '删除'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.mdData.splice(this.mdData.findIndex(item => item.mdId === row.mdId), 1)
                    this.$refs.domain.toggleSelect(row)
                  }
                }
              })
            ])
          }
        }
      ],
      resourceColumns: [
        {
          title: '选择',
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编码',
          key: 'resSerialnumber',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resSerialnumber
              }
            }, row.resSerialnumber)
          }
        },
        {
          title: '名称',
          key: 'resName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resName
              }
            }, row.resName)
          }
        },
        {
          title: '别名',
          key: 'resAlias',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAlias
              }
            }, row.resAlias)
          }
        },
        {
          title: '主类型',
          key: 'resMainType',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resMainType.resMtypeName
              }
            }, row.resMainType.resMtypeName)
          }
        },
        {
          title: '子类型',
          key: 'resSubtype',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resSubtype.resStypeName
              }
            }, row.resSubtype.resStypeName)
          }
        },
        {
          title: 'IP地址',
          key: 'resIpv4',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resIpv4
              }
            }, row.resIpv4)
          }
        },
        {
          title: '地址信息',
          key: 'resAddress',
          ellipsis: true,
          align: 'center',
          width: 170,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAddress
              }
            }, row.resAddress)
          }
        },
        {
          title: '操作',
          width: 70,
          align: 'center',
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-trash',
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '删除'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.resData.splice(this.resData.findIndex(item => item.resId === row.resId), 1)
                    this.$refs.resource.toggleSelect(row)
                  }
                }
              })
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      unit: state => state.user.organizationalUnit,
      userList: state => state.user.userList,
      userGroupList: state => state.user.userGroupList,
      abnormalType: state => state.statistics.abnormalType,
      faultDefinition: state => state.statistics.faultDefinition,
      mdList: state => state.device.maintainDomainInControls,
      resList: state => state.device.resList
    }),
    tree () {
      const tree = []
      this.unit.forEach(item => {
        tree.push(this.makeTree(item))
      })
      return tree
    }
  },
  created () {
    this.getUserGroupList({ pageIndex: 1, pageSize: 99999, grpType: '2' })
    this.getAbnormalType()
  },
  watch: {
    formData: {
      handler () {
        if (this.formData.type !== 2) return
        _.forIn(this.ids, (v, k) => {
          this.ids[k] = this.formData.info[k]
        })
        _.forIn(this.form, (v, k) => {
          this.form[k] = this.formData.info[k]
        })
        this.deptId = this.formData.info.deptId
        if (this.ids.abnormalIds && this.ids.abnormalIds.length) { // 当前故障定义tab有值
          this.faultData = []
          const data = this.faultDefinition
          this.ids.abnormalIds.forEach((item) => {
            const curret = data.find(row => row.moAbnormalId === item)
            this.faultData.push(curret)
            this.$refs.fault.toggleSelect(curret)
          })
        }
        if (this.ids.mdIds && this.ids.mdIds.length) { // 当前维护域tab有值
          this.mdData = []
          const data = this.mdList
          this.ids.mdIds.forEach((item) => {
            const current = data.find(row => row.mdId === item)
            this.mdData.push(current)
            this.$refs.domain.toggleSelect(current)
          })
        }
        if (this.ids.resIds && this.ids.resIds.length) { // 当前资源tab有值
          this.resData = []
          const data = this.resList
          this.ids.resIds.forEach((item) => {
            const current = data.find(row => row.resId === item)
            this.resData.push(current)
            this.$refs.resource.toggleSelect(current)
          })
        }
      },
      deep: true
    },
    deptId () {
      this.getUserList({ pageSize: 99999, deptId: this.deptId })
    },
    faultData () {
      this.ids.abnormalIds = []
      const data = this.faultData
      data.map(item => {
        this.ids.abnormalIds.push(item.moAbnormalId)
      })
    },
    mdData () {
      this.ids.mdIds = []
      const data = this.mdData
      data.map(item => {
        this.ids.mdIds.push(item.mdId)
      })
    },
    resData () {
      this.ids.resIds = []
      const data = this.resData
      data.map(item => {
        this.ids.resIds.push(item.resId)
      })
    }
  },
  methods: {
    ...mapActions([
      'getUserList',
      'getAbnormalType',
      'getUserGroupList'
    ]),
    faultEmit (data) {
      this.faultShow = false
      if (data.handle === 'cancel') return
      this.faultData = data.array
    },
    domainEmit (data) {
      this.domainShow = false
      if (data.handle === 'cancel') return
      this.mdData = data.array
    },
    resourceEmit (data) { // 选择资源组件向新增组件数据传递fun
      this.resourceShow = false
      if (data.handle === 'cancel') return
      this.resData = data.array
    },
    selectDel (key) { // 新增表单中对已选择的故障定义,维护域,资源进行批量删除操作
      const relationship = {
        abnormalIds: {
          name: '故障定义',
          ref: 'fault',
          origin: 'faultData',
          idMapping: 'moAbnormalId',
          fun: 'toggleSelect'
        },
        mdIds: {
          name: '维护域',
          ref: 'md',
          origin: 'mdData',
          idMapping: 'mdId',
          fun: 'toggleSelected'
        },
        resIds: {
          name: '资源',
          ref: 'resource',
          origin: 'resData',
          idMapping: 'resId',
          fun: 'toggleSelect'
        }
      }
      if (!this.select[key].length) return this.$Notice.warning({ title: `请勾选你要删除的${relationship[key].name}` })
      this.select[key].map(item => {
        const origin = this[relationship[key].origin]
        const index = origin.findIndex(data => data[relationship[key].idMapping] === item)
        this.$refs[relationship[key].ref][relationship[key].fun](origin[index]) // 先切换勾选状态,否则splice会对数据产生影响导致index发生变化
        origin.splice(index, 1)
      })
      this.select[key] = []
    },
    selectChanged (key, e) { // 新增或修改表单中对已经选择的故障定义,维护域,资源进行批量删除操作
      const idMap = {
        abnormalIds: 'moAbnormalId',
        mdIds: 'mdId',
        resIds: 'resId'
      }
      this.select[key] = []
      e.map(item => {
        this.select[key].push(item[idMap[key]])
      })
    },
    ok () { // 点击确定按钮
      this.defaultTab = '1'
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.formData.callback({ ...this.form, ...this.ids, deptId: this.deptId })
      })
    },
    cancel () { // 点击取消按钮
      this.formData.show = false
      this.clear()
    },
    clear () { // 表单清空
      setTimeout(() => {
        this.form = {
          showorder: 100,
          grpId: '',
          fmsName: '',
          dispatchflag: '',
          fmsStatus: '',
          beginTime: '',
          endTime: '',
          fmsDesc: '',
          deptName: '' // 该字段不是后端需要字段,但是需要在页面展示
        }
        this.ids = { // id集合
          fmsId: '',
          userId: '',
          resIds: [],
          mdIds: [],
          abnormalTypeIds: [],
          abnormalIds: []
        }
        this.defaultTab = '1'
        this.faultData = []
        this.resData = []
        this.mdData = []
        this.$refs['form'].resetFields()
      }, 300)
    },
    makeTree (node) { // 子类型节点树
      let n = {
        id: node.deptId,
        title: node.name,
        expand: true,
        render: this.renderDepartmentNode,
        children: []
      }
      if (node.children) {
        node.children.forEach(e => {
          n.children.push(this.makeTree(e))
        })
      }
      return n
    },
    renderDepartmentNode (h, { root, node, data }) {
      return h('span', {
        class: 'ivu-tree-title',
        on: {
          click: () => {
            this.form.deptName = data.title
            this.deptId = data.id
            this.deptShow = !this.deptShow
          }
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'md-folder',
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
