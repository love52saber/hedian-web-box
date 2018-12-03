<style lang="less">
.my-modal-parent .ivu-modal-mask {
  z-index: 1001;
}
.my-modal {
  z-index: 1002;
}
.g_create_order_container {
  box-sizing: border-box;
  .m_upload {
    list-style-type: none;
  }
  .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
    border-color: #04bbb7;
    background-color: #04bbb7;
    width: 40px;
    height: 40px;
    font-size: 20px;
    position: relative;
    top: -5px;
    line-height: 40px;
  }
  .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
    border-color: #04bbb7;
  }
  .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span,
  .ivu-steps-item.ivu-steps-status-finish
    .ivu-steps-head-inner
    > .ivu-steps-icon {
    color: #04bbb7;
  }
  .ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail > i:after {
    background: #04bbb7;
    width: 100%;
  }
  .ivu-steps .ivu-steps-tail > i::before {
    content: "";
    width: 0;
    height: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
  }
  .ivu-steps-item.ivu-steps-status-process .ivu-steps-tail > i:before {
    width: 50%;
    background: #04bbb7;
    opacity: 1;
    height: 1px;
    z-index: 10;
  }
  .ivu-steps-item:last-child .ivu-steps-tail {
    display: block;
  }
  .ivu-steps .ivu-steps-head,
  .ivu-steps .ivu-steps-main {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  .ivu-steps .ivu-steps-title {
    position: relative;
    left: -25px;
    top: 3px;
    padding-left: 10px;
  }
  .ivu-steps .ivu-steps-tail {
    padding: 0;
  }
  .ivu-steps-horizontal .ivu-steps-item:not(:first-child) .ivu-steps-head {
    z-index: 99;
  }
  .ivu-steps-horizontal .ivu-steps-content {
    padding-left: 0;
  }
  .m_step_label_container {
    .m_step_label_item {
      display: inline-block;
      position: relative;
      vertical-align: top;
      line-height: 18px;
      background-color: #eee;
      // padding: 5px;
      // margin: 5px;
      color: #999;
      border-radius: 3px;
      .popup {
        width: 0px;
        height: 0px;
        overflow: hidden;
        border-width: 8px;
        border-color: transparent transparent #eee transparent;
        border-style: solid;
        position: absolute;
        left: 50%;
        top: -15px;
        transform: translateX(-50%);
      }
    }
  }
  .ivu-tabs-mini {
    .ivu-tabs-nav-wrap {
      overflow: hidden;
      margin-bottom: 0;
      .ivu-tabs-nav-scroll {
        padding-left: 50px;
      }
    }
    .ivu-tabs-content {
      padding: 1px;
    }
  }
  .ivu-tabs-mini .ivu-tabs-tab {
    margin-right: 0;
    padding: 8px 16px;
    font-size: 12px;
    color: #04bbb7;
    border: 1px #04bbb7 solid;
    background: #f8f8f8;
  }
  .ivu-tabs-mini .ivu-tabs-bar {
    border-bottom: none;
    margin-bottom: 16px;
  }
  .ivu-tabs-nav .ivu-tabs-tab-active {
    color: #fff;
    background: #04bbb7;
  }
  .ivu-tabs-mini .ivu-tabs-ink-bar {
    background-color: #04bbb7;
  }
}
</style>
<template>
  <Modal v-model='params.show' class="g_create_order_container" :width='1200' :closable="false" :mask-closable="false" :styles="{top: '30px'}" :title='params.title'>
    <Form :label-width='100' :model="ids" ref="createOrder" :rules="rules">
      <Tabs type="card" v-model="defaultTab">
        <TabPane label="创建工单" name="create">
          <!-- 资源信息 -->
          <span style="margin-left:10px">
            <Icon type="md-arrow-dropdown" size="18" style="margin-right:10px" /> 资源信息
          </span>
          <Row>
            <i-col span="6">
              <FormItem prop='resId' label="资源名称">
                <Input readonly v-model="form.resName" placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="1" style="padding-left:10px">
              <Button type="primary" @click="resource.show = true">选择</Button>
            </i-col>
            <i-col span="1">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="资源别名">
                <Input readonly v-model="form.resAlias" placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem prop='resMtypeId' label="资源主类型">
                <Input readonly v-model="form.resMtypeName" placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem prop='resStypeId' label="资源子类型">
                <Input readonly v-model="form.resStypeName" placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="IP地址">
                <Input readonly v-model="form.resIpv4" placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="14">
              <FormItem label="资源地址">
                <Input readonly v-model="form.resAddress" placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
          </Row>
          <!-- 告警信息 -->
          <span style="margin-left:10px">
            <Icon type="md-arrow-dropdown" size="18" style="margin-right:10px" /> 告警信息
          </span>
          <Row>
            <i-col span="6">
              <FormItem label="告警序号">
                <Input readonly v-model="ids.resAbnormalId" placeholder="请先选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="1" style="padding-left:10px">
              <Button type="primary" :disabled="abnormal.btnDisabled" @click="abnormal.show = true">选择</Button>
            </i-col>
            <i-col span="1">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="告警名称">
                <Input readonly v-model='form.resAbnormalName' placeholder="请选择告警"></Input>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="告警时间">
                <Input readonly v-model="form.resAbnomaltime" placeholder="请选择告警"></Input>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="故障类型" prop='abnormalTypeId'>
                <Select :disabled="abnormal.selectDisabled" v-model="ids.abnormalTypeId">
                  <Option v-for="item in type" :value="item.abnormalTypeId" :key="item.abnormalTypeId">{{ item.abnormalTypeName }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="告警等级" prop='resAbnormallevelId'>
                <Select :disabled="abnormal.selectDisabled" v-model="ids.resAbnormallevelId">
                  <Option v-for="item in level" :value="item.resAbnormallevelId" :key="item.resAbnormallevelId">{{ item.resAbnormallevelName }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <!-- 工单信息 -->
          <span style="margin-left:10px">
            <Icon type="md-arrow-dropdown" size="18" style="margin-right:10px" /> 工单信息
          </span>
          <Row>
            <i-col span="6">
              <FormItem prop='wfTitle' label="工单标题">
                <Input v-model="form.wfTitle" placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="期望解决时长">
                <Input readonly :value='hopeTime' placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="最晚解决时长">
                <Input readonly :value='deadTime' placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="创建人">
                <Input readonly v-model="form.creatorName" placeholder="请选择告警或选择资源"></Input>
              </FormItem>
            </i-col>
            <i-col span="2">&nbsp;</i-col>
            <i-col span="6">
              <FormItem label="联系电话">
                <Input v-model="form.telephone" placeholder="请输入联系电话"></Input>
              </FormItem>
            </i-col>
            <i-col span="14">
              <FormItem label="故障描述">
                <Input type="textarea" v-model="form.resAbnormaldesc" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="请输入故障描述,最多输入120个汉字"></Input>
              </FormItem>
            </i-col>
            <i-col span="14">
              <FormItem label="附件">
                <Upload ref="upload" :show-upload-list='false' :max-size='2048' :headers="uploadHeaders" :on-error='uploadError' :before-upload="beforeUpload" :on-preview="handleView" :on-success='uploadSuccess' :action="uploadUri">
                  <Button type="text" icon="ios-cloud-upload-outline">上传</Button>
                </Upload>
                <div v-if="uploadList && uploadList.length">
                  <ul class="m_upload">
                    <li v-if="item.status === 'finished'" v-for="(item, index) in uploadList" :key="index">
                      <i-col span="6">{{item.name}}</i-col>
                      <i-col span="2">
                        <Button type="primary" v-if='!isDownLoad(item.name)' @click.native="handleView(item)">查看</Button>
                        <a v-if="isDownLoad(item.name)" :href="downloadUri(item)" target="_blank" :download="'222222'">
                          <Button type="primary">下载</Button>
                        </a>
                      </i-col>
                      <i-col span="2">
                        <Button type='text' @click.native="handleDeleteFile(item)">删除</Button>
                      </i-col>
                      <i-col span="2">
                        &nbsp;
                      </i-col>
                    </li>
                  </ul>
                </div>
              </FormItem>
            </i-col>
          </Row>
        </TabPane>
        <TabPane label="关联工单" name="relation">
          <Table border style="margin:1px" disabled-hover no-data-text='没有相关信息' :columns="relationColumns" :data="orderList" />
        </TabPane>
        <TabPane label="处理过程" name="process">
          <Tabs :animated="false" size="small">
            <TabPane label="表格">
              <Table border disabled-hover no-data-text='没有相关信息' :columns="columns" :data="orderList" />
            </TabPane>
            <TabPane label="图形">
              <Steps :current="0">
                <Step title="创建"></Step>
                <Step title="审核"></Step>
                <Step title="派发"></Step>
                <Step title="查看"></Step>
                <Step title="处理"></Step>
                <Step title="确认"></Step>
                <Step title="基层评价"></Step>
                <Step title="科信评价"></Step>
              </Steps>
              <div class="m_step_label_container">
                <div class="m_step_label_item" :style="{width: stepLabelWidth, textAlign: 'center'}">
                  <div class="popup"></div>
                  正在创建... <br />
                </div>
              </div>
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
    </Form>
    <div slot="footer" style="text-align:center;">
      <Button style="background:#04bbb7;width:100px" type="info" size="large" @click="ok">提交</Button>
      <Button style="background:#107ed1;width:100px" type="info" @click="save" size="large">保存</Button>
      <Button style="width:100px" type="default" size="large" @click="cancel">取消</Button>
    </div>
    <resource ref="resource" :show='resource.show' @callback='selectCallback' :pattern='0' :fixMainType='false' />
    <abnormal :pattern='0' :show="abnormal.show" @callback='selectCallback' :id="abnormal.checkedId" />
    <pick-person type="create" :show='pickPersonShow' />
  </Modal>
</template>
<script>
import { Resource, PickPerson, Abnormal } from '_c/controls'
import bus from '@/libs/bus'
import _ from 'lodash'
import { mapState } from 'vuex'
import { getUserInfo } from '@/libs/util'
export default {
  components: {
    Resource,
    Abnormal,
    PickPerson
  },
  props: {
    params: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      pickPersonShow: false, // 控制选择审批人显隐
      orderList: [],
      defaultTab: 'create',
      uploadList: [], // 待上传文件
      uploadLimit: 6, // 限制上传文件数
      abnormal: {
        show: false, // 控制显隐
        data: [], // 所选数据
        checkedId: '', // 已选数据id，用于控件默认勾选使用
        shouldUpdate: false, // 表单是否需要更新
        selectDisabled: false, // 下拉框是否禁止选择
        btnDisabled: false // 选择资源按钮是否禁用
      },
      resource: {
        show: false, // 控件显隐
        data: [], // 所选数据
        shouldUpdate: false // 是否需要更新表单
      },
      form: {
        currentStep: 0, // 当前流程节点,0=创建 *
        resAbnormalName: '', // 告警名称
        resAbnomaltime: '', // 告警时间
        abnormalTypeName: '', // 故障类型
        resAbnormallevelName: '', // 告警等级
        resName: '', // 资源名称
        resAlias: '', // 资源别名
        resMtypeName: '', // 资源主类型名称
        resStypeName: '', // 资源子类型名称
        resIpv4: '', // ip地址
        resAddress: '', // 资源地址
        wfTitle: '', // 工单标题 *
        hopeTime: '', // 期望时长
        deadTime: '', // 最晚时长
        telephone: '', // 联系电话 *
        resAbnormaldesc: '', // 故障描述 *
        creatorName: ''
      },
      url: [], // 上传的附件路径集合
      ids: { // id集合
        resAbnormalId: '', // 告警序号id
        abnormalTypeId: '', // 故障类型id
        resAbnormallevelId: '', // 故障等级id
        resId: '', // 资源id
        wfTitle: '', // 工单标题 *
        resMtypeId: '', // 主类型id
        resStypeId: '', // 子类型id
        userId: '', // 创建人的id
        woSlaId: '' // SLA工单id
      },
      relationColumns: [
        {
          title: '序号',
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
          title: '工单编码',
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
          title: '工单标题',
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
          title: '故障类型',
          key: 'resAbnormallevel',
          ellipsis: true,
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
          title: '资源名称',
          key: 'resAbnormallevel',
          ellipsis: true,
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
          title: '资源类型',
          key: 'resAbnormallevel',
          ellipsis: true,
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
          title: '当前节点',
          key: 'resAbnormallevel',
          ellipsis: true,
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
          title: '处理人',
          key: 'resAbnormallevel',
          ellipsis: true,
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
          title: '创建人',
          key: 'resAbnormallevel',
          ellipsis: true,
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
          title: '创建时间',
          key: 'resAbnormallevel',
          ellipsis: true,
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
          width: 100,
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: window.config.DELETE_ICON,
                  color: '#04bbb7',
                  size: 20
                },
                attrs: {
                  title: '查看'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                  }
                }
              })
            ])
          }
        }
      ],
      rules: { // 表单校验规则
        abnormalTypeId: [
          { required: true, type: 'number', message: '故障类型不能为空', trigger: 'change' }
        ],
        resAbnormallevelId: [
          { required: true, type: 'number', message: '告警等级不能为空', trigger: 'change' }
        ],
        resId: [
          { required: true, type: 'number', message: '资源名称不能为空', trigger: 'change' }
        ],
        resMtypeId: [
          { required: true, type: 'number', message: '资源主类型不能为空', trigger: 'change' }
        ],
        resStypeId: [
          { required: true, type: 'number', message: '资源子类型不能为空', trigger: 'change' }
        ],
        wfTitle: [
          { required: true, type: 'string', message: '工单标题不能为空', trigger: 'blur' }
        ]
      },
      imgType: ['webp', 'bmp', 'gif', 'jpeg', 'svg', 'psd', 'png', 'jpg'],
      columns: [
        {
          title: '序号',
          key: 'fmsId',
          width: 80,
          ellipsis: true,
          className: 'fixHeight',
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.fmsId
              }
            }, row.fmsId)
          }
        },
        {
          title: '处理环节',
          key: 'fmsId',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.fmsId
              }
            }, row.fmsId)
          }
        },
        {
          title: '处理人',
          key: 'fmsId',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.fmsId
              }
            }, row.fmsId)
          }
        },
        {
          title: '处理时间',
          key: 'fmsId',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.fmsId
              }
            }, row.fmsId)
          }
        },
        {
          title: '处理意见',
          key: 'fmsId',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.fmsId
              }
            }, row.fmsId)
          }
        }
      ]
    }
  },
  mounted () {
    // 挂在监听提交事件
    bus.$on('submitWf', (user) => {
      console.log('receive message ===', user)
      this.submitWf(user)
    })

    // 监控uploadList
    this.uploadList = this.$refs.upload.fileList

    // 监控params参数对象
    this.$watch('params', () => {
      if (!this.params.show) return
      // 创建人id赋值
      this.ids.userId = this.$store.state.user.userId
      this.form.telephone = JSON.parse(getUserInfo()).mobile
      this.form.creatorName = this.$store.state.user.username
    }, { deep: true })

    // 监控resource对象，若值发生改变，更新页面
    this.$watch('resource', () => {
      if (!this.resource.shouldUpdate) return
      this.resource.shouldUpdate = !this.resource.shouldUpdate
      this.$refs.createOrder.resetFields() // 重置表单避免表单已被校验过一次，选择后仍显示校验信息
      const willBeCleaned = ['resAbnormalId', 'resAbnormalName', 'resAbnomaltime', 'abnormalTypeName', 'resAbnormallevelName', 'abnormalTypeId', 'resAbnormallevelId', 'wfTitle', 'resAbnormaldesc']
      willBeCleaned.forEach(currentItem => {
        if (_.has(this.form, currentItem)) {
          this.form[currentItem] = ''
        }
        if (_.has(this.ids, currentItem)) {
          this.ids[currentItem] = ''
        }
      })
      this.ids.resId = this.resource.data[0].resId // 这里只对资源id（resId）赋值修改，会触发对ids对象的监控函数
      bus.$emit('resIdChanged', this.ids.resId)
    }, { deep: true })

    // 监控abnormal对象，若值发生改变，更新页面
    this.$watch('abnormal', () => {
      if (!this.abnormal.shouldUpdate) return
      this.abnormal.shouldUpdate = !this.abnormal.shouldUpdate
      const key = ['resAbnormalName', 'resAbnomaltime', 'abnormalTypeName', 'resAbnormallevelName', 'resAbnormalId', 'abnormalTypeId', 'resAbnormaldesc', 'resAbnormallevelId']
      /*, 'resId' */
      key.forEach(currentItem => {
        if (_.has(this.form, currentItem)) {
          this.form[currentItem] = this.abnormal.data[0][currentItem]
        }
        if (_.has(this.ids, currentItem)) {
          this.ids[currentItem] = this.abnormal.data[0][currentItem]
        }
      })
      this.form.wfTitle = this.ids.resAbnormalId !== '' ? this.form.resName + this.form.resAbnormalName : ''
    }, { deep: true })

    // 监控ids对象，若resId有值，则匹配资源
    this.$watch('ids', () => {
      this.abnormal.btnDisabled = this.ids.resId === '' // 不选择资源则无法选择告警
      this.abnormal.selectDisabled = this.ids.resAbnormalId !== '' // 选择了告警则无法更改故障类型与告警等级
      if (!(this.ids.resId + '')) return // 防止id为0，故加了空字符串
      const key = ['resMtypeId', 'resStypeId', 'resName', 'resAlias', 'resStypeName', 'resMtypeName', 'resIpv4', 'resAddress']
      const resData = this.$store.state.device.resList.find(item => item.resId === this.ids.resId)
      if (!resData) return
      key.forEach(currentItem => {
        if (_.has(this.form, currentItem)) {
          this.form[currentItem] = resData[currentItem] ? resData[currentItem] : ''
        }
        if (_.has(this.ids, currentItem)) {
          this.ids[currentItem] = resData[currentItem] ? resData[currentItem] : ''
        }
      })
      this.form.resMtypeName = resData.resMainType.resMtypeName // 因为数据结构多了一层，故值为undefined，所以需要重新赋值一下
      this.form.resStypeName = resData.resSubtype.resStypeName
      console.log({ ...this.form, ...this.ids })
    }, { deep: true })

    // 将form下的工单标题拿到ids，以便于做表单校验
    this.$watch('form', () => { // 发现问题：用户直接修改输入框中的值，会触发ids的监控函数，进入死循环
      this.ids.wfTitle = this.form.wfTitle
    }, { deep: true })
  },
  created () {
    this.$store.dispatch('getAbnormalType') // 查询故障类型
    this.$store.dispatch('getSLA') // 查询工单SLA考核
  },
  computed: {
    ...mapState({
      level: state => state.statistics.abnormalLevel,
      type: state => state.statistics.abnormalType,
      hopeTime: state => state.order.SLA ? state.order.SLA.hopetime + '小时' : '',
      deadTime: state => state.order.SLA ? state.order.SLA.deadtime + '小时' : '',
      woSlaId: state => state.order.SLA ? state.order.SLA.woSlaId : ''
    }),
    stepLabelWidth () {
      return (100 / 8) + '%'
    },
    uploadUri () { // 上传地址
      return window.config.baseUrl + '/api/resource'
    },
    uploadHeaders () { // 上传请求头
      return {
        Authorization: this.$store.state.user.token ? this.$store.state.user.token : window.localStorage.getItem('token')
      }
    }
  },
  methods: {
    selectCallback (e) { // 选择回调函数 ,用target字段区分是告警还是资源
      const arr = ['ok', 'cancel']
      const t = ['resource', 'abnormal']
      if (!arr.includes(e.handle) || !t.includes(e.target)) return
      this[e.target].show = false
      this[e.target].shouldUpdate = false
      if (e.handle === 'cancel' || !(e.array && e.array.length)) return
      this[e.target].data = e.array
      this[e.target].shouldUpdate = true
    },
    downloadUri (file) { // 下载地址
      return window.config.fileHost + file.response.data
    },
    isDownLoad (name) { // 是否可以下载，图片类型对应查看按钮，非图片类型对应下载按钮
      const index = name.lastIndexOf('.')
      const format = name.substring(index + 1, name.length)
      return !this.imgType.includes(format)
    },
    handleView (file) { // 图片类型文件查看函数
      if (file.response.msg !== 'success') return
      const index = file.name.lastIndexOf('.')
      const format = file.name.substring(index + 1, file.name.length)
      if (!this.imgType.includes(format.toLowerCase())) return
      this.$Modal.confirm({
        title: file.name,
        render: (h) => {
          return h('img', {
            attrs: {
              src: window.config.fileHost + file.response.data
            },
            style: {
              display: 'block',
              margin: '20px auto 0',
              width: '100%'
            }
          })
        }
      })
    },
    handleDeleteFile (file) { // 删除文件，需要把url中也删去
      const fileList = this.$refs.upload.fileList
      this.url.splice(this.url.findIndex(item => item === file.response.data), 1)
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    beforeUpload (file) { // upload组件钩子，上传文件前，做对应限制操作，如文件数量的限制
      const check = this.uploadList.length < this.uploadLimit
      if (!check) this.$Notice.error({ title: `最多上传${this.uploadLimit}个文件` })
      return check
    },
    uploadError (error, file, fileList) { // upload组件钩子，上传文件出错函数
      this.$Message.error(JSON.parse(error))
    },
    uploadSuccess (response, file, fileList) { // upload组件钩子，上传成功函数
      if (response.msg !== 'success') return
      this.url.push(response.data)
    },
    ok () { // 点击提交按钮按钮
      this.defaultTab = 'create'
      this.$refs.createOrder.validate((valid) => {
        if (!valid) return
        this.pickPersonShow = true
      })
    },
    submitWf (user) { // 真正提交工单
      this.pickPersonShow = false
      if (!user) return
      this.$emit('submit', {
        type: 2, // 列表页定义了switch语句， 2标识提交
        params: {
          ...this.ids,
          ...this.form,
          woSlaId: this.woSlaId,
          currentStep: 1,
          currentUser: user,
          url: this.url.join('|')
        }
      })
    },
    save () { // 点击保存按钮
      this.$refs.createOrder.validate((valid) => {
        if (!valid) return
        this.$emit('submit', {
          type: 1, // 列表页定义了switch语句 1标识保存
          params: {
            ...this.ids,
            ...this.form,
            woSlaId: this.woSlaId,
            url: this.url.join('|')
          }
        })
      })
    },
    cancel () { // 点击取消按钮
      this.params.show = false
      this.params.info = {}
      this.clear()
    },
    clear () { // 表单清空
      setTimeout(() => {
        this.$refs.createOrder.resetFields()
        this.abnormal = {
          show: false, // 控制显隐
          data: [], // 所选数据
          checkedId: '', // 已选数据id，用于控件默认勾选使用
          shouldUpdate: false // 表单是否需要更新
        }
        this.resource = {
          show: false, // 控件显隐
          data: [], // 所选数据
          shouldUpdate: false, // 是否需要更新表单
          btnDisabled: false // 选择资源按钮是否禁用，已弃用 *
        }
        this.form = {
          currentStep: 0, // 当前流程节点,0=创建 *
          resAbnormalName: '', // 告警名称
          resAbnomaltime: '', // 告警时间
          abnormalTypeName: '', // 故障类型
          resAbnormallevelName: '', // 告警等级
          resName: '', // 资源名称
          resAlias: '', // 资源别名
          resMtypeName: '', // 资源主类型名称
          resStypeName: '', // 资源子类型名称
          resIpv4: '', // ip地址
          resAddress: '', // 资源地址
          wfTitle: '', // 工单标题 *
          hopeTime: '', // 期望时长
          deadTime: '', // 最晚时长
          telephone: '', // 联系电话 *
          resAbnormaldesc: '', // 故障描述 *
          creatorName: ''
        }
        this.url = [] // 上传的附件路径集合
        this.uploadList = []
        this.ids = { // id集合
          resAbnormalId: '', // 告警序号id
          abnormalTypeId: '', // 故障类型id
          resAbnormallevelId: '', // 故障等级id
          resId: '', // 资源id
          resMtypeId: '', // 主类型id
          resStypeId: '', // 子类型id
          userId: '', // 创建人的id
          woSlaId: '' // SLA工单id
        }
      }, 300)
    }
  }
}
</script>
