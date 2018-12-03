<style lang="less">
.g_order_detail {
  .m_form_item {
    margin-bottom: 0px;
    .m_upload {
      list-style-type: none;
    }
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
      vertical-align: top;
      line-height: 18px;
      color: #2e4251;
      .content {
        margin: 5px;
        position: relative;
        padding: 5px;
        background-color: #f1f1f1;
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
  }
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
  <Modal v-model='detail.show' class="g_order_detail" :width='1200' :closable="false" :mask-closable="false" :styles="{top: '30px'}" title='查看工单'>
    <Form :label-width='100'>
      <Tabs type="card" v-model="defaultTab">
        <TabPane label="工单信息" name="info">
          <!-- 资源信息 -->
          <div class="mb20">
            <span class="ml10">
              <Icon class="mr10" :type="expand.resource? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" @click="expandCtrl('resource')" /> 资源信息
            </span>
            <Button class="fr" @click="expandCtrl('resource')" type="text">{{expand.resource? '收起': '展开'}}</Button>
            <Row :gutter="32" v-show="expand.resource">
              <i-col span="8">
                <FormItem class="m_form_item" label="资源名称：">
                  {{info.resBase ? info.resBase.resName : ''}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="资源别名：">
                  {{info.resBase ? info.resBase.resAlias : ''}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="资源主类型：">
                  {{info.resMtypeName}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="资源子类型：">
                  {{info.resStypeName}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="mb10" label="IP地址：">
                  {{info.resBase ? info.resBase.resIpv4 : ''}}
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem class="m_form_item" label="资源地址：">
                  {{info.resBase ? info.resBase.resAddress : ''}}
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 告警信息 -->
          <div class="mb20">
            <span class="ml10">
              <Icon class="mr10" :type="expand.abnormal? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" @click="expandCtrl('abnormal')" /> 告警信息
            </span>
            <Button class="fr" @click="expandCtrl('abnormal')" type="text">{{expand.abnormal? '收起': '展开'}}</Button>
            <Row :gutter="32" v-show="expand.abnormal">
              <i-col span="8">
                <FormItem class="m_form_item" label="告警序号：">
                  {{info.resAbnormalId}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="告警名称：">
                  {{info.resAbnormalName}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="告警时间：">
                  {{info.resAbnomaltime}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="故障类型：">
                  {{info.abnormalTypeName}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="告警等级：" prop='resAbnormallevelId'>
                  {{info.resAbnormallevelName}}
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 工单信息 -->
          <div class="mb20">
            <span class="ml10">
              <Icon class="mr10" @click="expandCtrl('workflow')" :type="expand.workflow? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" /> 工单信息
            </span>
            <Button class="fr" @click="expandCtrl('workflow')" type="text">{{expand.workflow? '收起': '展开'}}</Button>
            <Row :gutter="40" v-show="expand.workflow">
              <i-col span="8">
                <FormItem class="m_form_item" label="工单标题：">
                  {{info.wfTitle}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="期望解决时长：">
                  {{info.hopetime ? info.hopetime + '小时': ''}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="最晚解决时长：">
                  {{info.deadtime ? info.deadtime + '小时': ''}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="创建人：">
                  {{info.username}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="联系电话：">
                  {{info.telephone}}
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem class="m_form_item" label="故障描述：">
                  {{info.resAbnormaldesc}}
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem class="m_form_item" label="附件：">
                  <div>
                    <ul class="m_upload">
                      <li v-for="(item, index) in info.url" :key="index">
                        <i-col span="3">{{item.substring(item.lastIndexOf('/')+1, item.length)}}</i-col>
                        <i-col span="2">
                          <Button type="primary" v-if='!isDownLoad(item)' @click.native="handleView(item)">查看</Button>
                          <a v-if="isDownLoad(item)" :href="downloadUri(item)" :download="'222222'">
                            <Button type="primary">下载</Button>
                          </a>
                        </i-col>
                        <i-col span="1">&nbsp;</i-col>
                      </li>
                    </ul>
                  </div>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 审核信息 -->
          <div class="mb10" v-if="info.currentStep > 1">
            <span class="ml10">
              <Icon class="mr10" @click="expandCtrl('review')" :type="expand.review? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" /> 审核信息
            </span>
            <Button class="fr" @click="expandCtrl('review')" type="text">{{expand.review? '收起': '展开'}}</Button>
            <Row :gutter="40" v-show="expand.review">
              <i-col span="8">
                <FormItem class="m_form_item" label="故障类型：">
                  {{info.abnormalTypeName}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="告警等级：">
                  {{info.resAbnormallevelName}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="派单人：">
                  {{info.wfReviewInfoModel.disName}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="联系电话">
                  {{info.wfReviewInfoModel.disPhone}}
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem class="m_form_item" label="审核意见">
                  {{info.wfReviewInfoModel.reviewDesc}}
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 派单信息 -->
          <div class="mb10" v-if="info.currentStep > 2">
            <span class="ml10">
              <Icon class="mr10" @click="expandCtrl('dispatch')" :type="expand.dispatch? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" /> 派发信息
            </span>
            <Button style="float:right" @click="expandCtrl('dispatch')" type="text">{{expand.dispatch? '收起': '展开'}}</Button>
            <Row :gutter="40" v-show="expand.dispatch">
              <i-col span="8">
                <FormItem class="m_form_item" label="维修人：">
                  {{info.wfDisInfoModel.overName}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="联系电话：">
                  {{info.wfDisInfoModel.overPhone }}
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem class="m_form_item" label="派发意见：">
                  {{info.wfDisInfoModel.disInfo}}
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 查看故障 -->
          <div class="mb20" v-if="info.currentStep > 3">
            <span class="ml10">
              <Icon class="mr10" @click="expandCtrl('lookthrough')" :type="expand.lookthrough? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" /> 查看故障
            </span>
            <Button class="fr" @click="expandCtrl('lookthrough')" type="text">{{expand.lookthrough? '收起': '展开'}}</Button>
            <Row :gutter="40" v-show="expand.lookthrough">
              <i-col span="8">
                <FormItem class="m_form_item" label="维修人：">
                  {{info.wfOverInfoModel.handleName}}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="联系电话：">
                  {{info.wfOverInfoModel.handlePhone }}
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem class="m_form_item" label="维修类型：">
                  <Checkbox disabled v-model="info.wfOverInfoModel.overType">拆除/维护中</Checkbox>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem class="m_form_item" label="故障描述：">
                  {{info.wfOverInfoModel.overInfo}}
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem class="m_form_item" label="附件：">
                  <div>
                    <ul class="m_upload">
                      <li v-for="(item, index) in info.wfOverInfoModel.overFile.split('|')" :key="index">
                        <i-col span="3">{{item.substring(item.lastIndexOf('/')+1, item.length)}}</i-col>
                        <i-col span="2">
                          <Button type="primary" v-if='!isDownLoad(item)' @click.native="handleView(item)">查看</Button>
                          <a v-if="isDownLoad(item)" :href="downloadUri(item)" :download="'222222'">
                            <Button type="primary">下载</Button>
                          </a>
                        </i-col>
                        <i-col span="1">&nbsp;</i-col>
                      </li>
                    </ul>
                  </div>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 处理工单 -->
          <div class="mb20" v-if="info.currentStep > 4">
            <span class="ml10">
              <Icon class="mr10" @click="expandCtrl('handle')" :type="expand.handle? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" /> 处理工单
            </span>
            <Button class="fr" @click="expandCtrl('handle')" type="text">{{expand.handle? '收起': '展开'}}</Button>
            <Row :gutter="40" v-show="expand.handle">
              <i-col span="8">
                <FormItem class="m_form_item" label="维修类型：">
                  <Checkbox disabled v-model="info.wfHandleInfoModel.handleType">拆除/维护中</Checkbox>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem class="m_form_item" label="故障原因：">
                  {{info.wfHandleInfoModel.handleInfo}}
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem class="m_form_item" label="解决方法：">
                  {{info.wfHandleInfoModel.handleMethod}}
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem class="m_form_item" label="附件：">
                  <div>
                    <ul class="m_upload">
                      <li v-for="(item, index) in info.wfHandleInfoModel.handleFile.split('|')" :key="index">
                        <i-col span="3">{{item.substring(item.lastIndexOf('/')+1, item.length)}}</i-col>
                        <i-col span="2">
                          <Button type="primary" v-if='!isDownLoad(item)' @click.native="handleView(item)">查看</Button>
                          <a v-if="isDownLoad(item)" :href="downloadUri(item)" :download="'222222'">
                            <Button type="primary">下载</Button>
                          </a>
                        </i-col>
                        <i-col span="1">&nbsp;</i-col>
                      </li>
                    </ul>
                  </div>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 确认工单 -->
          <div style="margin-bottom:20px" v-if="info.currentStep > 5">
            <span style="margin-left:10px">
              <Icon class="mr10" @click="expandCtrl('verify')" :type="expand.verify? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" /> 确认工单
            </span>
            <Button class="fr" @click="expandCtrl('verify')" type="text">{{expand.verify? '收起': '展开'}}</Button>
            <Row :gutter="40" v-show="expand.verify">
              <i-col span="24">
                <FormItem class="m_form_item" label="确认意见：">
                  {{info.wfConfirmInfoModel.confirmInfo}}
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 基础评价 -->
          <div style="margin-bottom:20px" v-if="info.currentStep > 6">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('baseEval')" :type="expand.baseEval? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 基层评价
            </span>
            <Button class="fr" @click="expandCtrl('baseEval')" type="text">{{expand.baseEval? '收起': '展开'}}</Button>
            <Row :gutter="40" v-show="expand.baseEval">
              <i-col span="8">
                <FormItem class="m_form_item" label="评价得分：">
                  <Rate disabled allow-half v-model="info.wfBaseAppraInfoModel.baseAppraScore"></Rate>
                </FormItem>
              </i-col>
              <i-col span="16">
                <FormItem class="m_form_item" label="评价意见：">
                  {{info.wfBaseAppraInfoModel.baseAppraInfo}}
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 科信评价 -->
          <div class="mb20" v-if="info.wfStatus">
            <span class="ml10">
              <Icon class="mr10" @click="expandCtrl('kexinEval')" :type="expand.kexinEval? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" /> 科信评价
            </span>
            <Button class="fr" @click="expandCtrl('kexinEval')" type="text">{{expand.kexinEval? '收起': '展开'}}</Button>
            <Row :gutter="40" v-show="expand.kexinEval">
              <i-col span="8">
                <FormItem class="m_form_item" label="评价得分：">
                  <Rate disabled allow-half v-model="info.wfKexinAppraInfoModel.kexinAppraScore"></Rate>
                </FormItem>
              </i-col>
              <i-col span="16">
                <FormItem class="m_form_item" label="评价意见：">
                  {{info.wfKexinAppraInfoModel.kexinAppraInfo}}
                </FormItem>
              </i-col>
            </Row>
          </div>
        </TabPane>
        <TabPane label="关联工单" name="relation">
          <Table border style="margin:1px" disabled-hover no-data-text='没有相关信息' :columns="relationColumns" :data="orderList" />
        </TabPane>
        <TabPane label="处理过程" name="process">
          <Tabs :animated="false" size="small">
            <TabPane label="表格">
              <Table border disabled-hover no-data-text='没有相关信息' :columns="columns" :data="stepLabel" />
            </TabPane>
            <TabPane label="图形">
              <Steps :current="info.currentStep">
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
                <div class="m_step_label_item" v-for="(item) in stepLabel" :key="item.time" :style="{width: stepLabelWidth,}">
                  <div class="content">
                    <div class="popup"></div>
                    处理人：{{item.name}} <br />
                    处理时间：{{item.time}} <br />
                    处理意见: {{item.info}}
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
    </Form>
    <div slot="footer" style="text-align:center;">
      <Button style="background:#04bbb7;width:100px" type="info" size="large" @click="ok">确定</Button>
    </div>
  </Modal>
</template>
<script>
import _ from 'lodash'
export default {
  props: {
    detail: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      defaultTab: 'info',
      orderList: [],
      imgType: ['webp', 'bmp', 'gif', 'jpeg', 'svg', 'psd', 'png', 'jpg'],
      expand: { // 控制表单域分组的显示和隐藏，配合展开收起一起使用
        resource: true,
        abnormal: true,
        workflow: true,
        review: false,
        dispatch: false,
        lookthrough: false,
        handle: false,
        verify: false,
        baseEval: false,
        kexinEval: false
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
          className: 'fixHeight',
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
          className: 'fixHeight',
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
          title: '资源名称',
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
          title: '资源类型',
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
          title: '当前节点',
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
          title: '处理人',
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
          title: '创建人',
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
          title: '创建时间',
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
          width: 100,
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'ios-trash',
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
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 80,
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.index
              }
            }, row.index)
          }
        },
        {
          title: '处理环节',
          key: 'step',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.step
              }
            }, row.step)
          }
        },
        {
          title: '处理人',
          key: 'name',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.name
              }
            }, row.name)
          }
        },
        {
          title: '处理时间',
          key: 'time',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.time
              }
            }, row.time)
          }
        },
        {
          title: '处理意见',
          key: 'info',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.info
              }
            }, row.info)
          }
        }
      ]
    }
  },
  computed: {
    stepLabelWidth () {
      return (100 / 8) + '%'
    },
    info () {
      const data = _.cloneDeep(this.detail.info)
      data.url = data.url ? (_.isArray(data.url) ? data.url : data.url.split('|')) : []

      return data
    },
    stepLabel () {
      if (!this.info.wfId) return []
      let label = []
      const labelMap = { // 对应后端返回字段
        'wfReviewInfoModel': {
          info: 'reviewDesc',
          time: 'reviewTime',
          name: 'currentReviewName'
        },
        'wfDisInfoModel': {
          info: 'disInfo',
          time: 'disTime',
          name: 'currentDisName'
        },
        'wfOverInfoModel': {
          info: 'overInfo',
          time: 'overTime',
          name: 'currentOverName'
        },
        'wfHandleInfoModel': {
          info: 'handleInfo',
          time: 'handleTime',
          name: 'currentHandleName'
        },
        'wfConfirmInfoModel': {
          info: 'confirmInfo',
          time: 'confirmTime',
          name: 'currentConfirmName'
        },
        'wfBaseAppraInfoModel': {
          info: 'baseAppraInfo',
          time: 'baseAppraTime',
          name: 'currentBaseAppraName'
        },
        'wfKexinAppraInfoModel': {
          info: 'kexinAppraInfo',
          time: 'kexinAppraTime',
          name: 'currentKexinAppraName'
        }
      }
      const keys = _.keys(labelMap)
      for (let i = 0; i < this.info.currentStep - 1; i++) {
        label.push({
          info: _.get(this.info, `${keys[i]}.${labelMap[keys[i]].info}`, ''),
          name: _.get(this.info, `${keys[i]}.${labelMap[keys[i]].name}`, ''),
          time: _.get(this.info, `${keys[i]}.${labelMap[keys[i]].time}`, ''),
          step: this.$store.state.order.flowMap[i + 1],
          index: i + 2
        })
      }
      label.unshift({
        name: this.info.username,
        time: this.info.gmtCreate,
        info: this.info.resAbnormaldesc,
        step: '创建',
        index: 1
      })
      return label
    }
  },
  methods: {
    expandCtrl (ref) { // 控制表单域的显示或隐藏
      this.expand[ref] = !this.expand[ref]
    },
    ok () { // 确定按钮点击
      this.detail.show = false
      this.expand = { // 控制表单域分组的显示和隐藏，配合展开收起一起使用
        resource: true,
        abnormal: true,
        workflow: true,
        review: false,
        dispatch: false,
        lookthrough: false,
        handle: false,
        verify: false,
        baseEval: false,
        kexinEval: false
      }
    },
    isDownLoad (url) { // 是否可以下载，图片类型对应查看按钮，非图片类型对应下载按钮
      const index = url.lastIndexOf('.')
      const format = url.substring(index + 1, url.length)
      return !this.imgType.includes(format)
    },
    downloadUri (url) { // 下载地址
      return window.config.fileHost + url
    },
    handleView (url) { // 图片类型文件查看函数
      const index = url.lastIndexOf('.')
      const format = url.substring(index + 1, url.length)
      if (!this.imgType.includes(format.toLowerCase())) return
      this.$Modal.confirm({
        title: url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')),
        render: (h) => {
          return h('img', {
            attrs: {
              src: window.config.fileHost + url
            },
            style: {
              display: 'block',
              margin: '20px auto 0',
              width: '100%'
            }
          })
        }
      })
    }
  }

}
</script>
