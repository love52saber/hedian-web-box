<style lang="less">
.my-modal-parent .ivu-modal-mask {
  z-index: 1001;
}
.my-modal {
  z-index: 1002;
}
.g_wf_container {
  box-sizing: border-box;
  .m_upload {
    list-style-type: none;
  }
  .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
    border-color: #04bbb7;
    background-color: #04bbb7;
    width: 30px;
    height: 30px;
    font-size: 18px;
    position: relative;
    top: -5px;
    line-height: 30px;
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
  <Modal v-model='params.show' class="g_wf_container" :width='1300' :closable="false" :mask-closable="false" :styles="{top: '30px'}" :title='params.title'>
    <Form :label-width='100' ref="workflow" :rules="rules">
      <Tabs type="card" v-model="defaultTab">
        <TabPane label="处理工单" name="create">
          <!-- 资源信息 -->
          <div style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('resource')" :type="expand.resource? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 资源信息
            </span>
            <Button style="float:right" @click="expandCtrl('resource')" type="text">{{expand.resource? '收起': '展开'}}</Button>
            <Row v-show="expand.resource">
              <i-col span="6">
                <FormItem label="资源名称">
                  <Input readonly v-model="baseForm.resName" placeholder="请选择告警或选择资源"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="资源别名">
                  <Input readonly v-model="baseForm.resAlias" placeholder="请选择告警或选择资源"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="资源主类型">
                  <Input readonly v-model="baseForm.resMtypeName" placeholder="请选择告警或选择资源"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="资源子类型">
                  <Input readonly v-model="baseForm.resStypeName" placeholder="请选择告警或选择资源"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="IP地址">
                  <Input readonly v-model="baseForm.resIpv4" placeholder="请选择告警或选择资源"></Input>
                </FormItem>
              </i-col>
              <i-col span="14">
                <FormItem label="资源地址">
                  <Input readonly v-model="baseForm.resAddress" placeholder="请选择告警或选择资源"></Input>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 告警信息 -->
          <div style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('abnormal')" :type="expand.abnormal? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 告警信息
            </span>
            <Button style="float:right" @click="expandCtrl('abnormal')" type="text">{{expand.abnormal? '收起': '展开'}}</Button>
            <Row v-show="expand.abnormal">
              <i-col span="6">
                <FormItem label="告警序号">
                  <Input readonly v-model="baseForm.resAbnormalId" placeholder="告警序号"></Input>
                </FormItem>
              </i-col>

              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="告警名称">
                  <Input readonly v-model='baseForm.resAbnormalName' placeholder="告警名称"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="告警时间">
                  <Input readonly v-model="baseForm.resAbnomaltime" placeholder="告警时间"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="故障类型">
                  <Input readonly v-model="baseForm.abnormalTypeName" placeholder="故障类型"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="告警等级">
                  <Input readonly v-model="baseForm.resAbnormallevelName" placeholder="告警等级"></Input>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 工单信息 -->
          <div style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('workflow')" :type="expand.workflow? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 工单信息
            </span>
            <Button style="float:right" @click="expandCtrl('workflow')" type="text">{{expand.workflow? '收起': '展开'}}</Button>
            <Row v-show="expand.workflow">
              <i-col span="6">
                <FormItem label="工单标题">
                  <Input readonly v-model="baseForm.wfTitle" placeholder="工单标题"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="期望解决时长">
                  <Input readonly :value='baseForm.hopetime' placeholder="期望解决时长"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="最晚解决时长">
                  <Input readonly :value='baseForm.deadtime' placeholder="最晚解决时长"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="创建人">
                  <Input readonly v-model="baseForm.username" placeholder="创建人"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="联系电话">
                  <Input readonly v-model="baseForm.telephone" placeholder="联系电话"></Input>
                </FormItem>
              </i-col>
              <i-col span="14">
                <FormItem label="故障描述">
                  <Input readonly type="textarea" v-model="baseForm.resAbnormaldesc" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="故障描述"></Input>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem label="附件">
                  <div v-if="baseUrl && baseUrl.length">
                    <ul class="m_upload">
                      <li v-for="(item, index) in baseUrl" :key="index">
                        <i-col span="3">{{item.substring(item.lastIndexOf('/')+1, item.length)}}</i-col>
                        <i-col span="2">
                          <Button type='text' v-if='!isDownLoad(item)' @click.native="handleView(item)">查看</Button>
                          <a v-if="isDownLoad(item)" :href="downloadUri(item)" target="_blank" :download="'test'">
                            <Button type='text'>下载</Button>
                          </a>
                        </i-col>
                        <i-col span="1">&nbsp; </i-col>
                      </li>
                    </ul>
                  </div>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 审核信息 -->
          <div style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('review')" :type="expand.review? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 审核信息
            </span>
            <Button style="float:right" @click="expandCtrl('review')" type="text">{{expand.review? '收起': '展开'}}</Button>
            <Row v-show="expand.review">
              <i-col span="6">
                <FormItem required label="故障类型">
                  <Select :disabled="baseForm.resAbnormalId !== '' || currentStep !== 1" v-model="baseForm.abnormalTypeId">
                    <Option v-for="item in type" :value="item.abnormalTypeId" :key="item.abnormalTypeId">{{ item.abnormalTypeName }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem required label="告警等级">
                  <Select :disabled="baseForm.resAbnormalId !== '' || currentStep !== 1" v-model="baseForm.resAbnormallevelId">
                    <Option v-for="item in level" :value="item.resAbnormallevelId" :key="item.resAbnormallevelId">{{ item.resAbnormallevelName }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="1">&nbsp;</i-col>
              <i-col span="6" v-if="currentStep === 1">
                <FormItem label="维护单位">
                  <Input readonly v-model="deptName" placeholder="维护单位"></Input>
                  <div v-show="deptShow" style="border:1px #ccc solid;height:200px;position:absolute;z-index:999;width:100%;background:#fff;overflow:auto;top:-200px">
                    <Tree class='m_tree' :data='tree'></Tree>
                  </div>
                </FormItem>
              </i-col>
              <i-col span="1" v-if="currentStep === 1" style="padding-left:10px">
                <Button type="primary" @click.stop="deptShow = true">选择</Button>
              </i-col>
              <i-col span="1">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="派单人">
                  <Select v-if="currentStep === 1" v-model="review.disUserId">
                    <Option v-for="item in wfUserList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
                  </Select>
                  <Input v-else readonly v-model="review.disName" placeholder="派单人"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="联系电话">
                  <Input readonly :value="userPhone('review', 'disUserId', 'disPhone')" placeholder="联系电话"></Input>
                </FormItem>
              </i-col>
              <i-col span="20">
                <FormItem label="审核意见">
                  <Input type="textarea" :readonly="currentStep !==1" v-model="review.reviewDesc" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="审核意见，不超过120字"></Input>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 派发信息 -->
          <div v-if="currentStep >= 2" style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('dispatch')" :type="expand.dispatch? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 派发信息
            </span>
            <Button style="float:right" @click="expandCtrl('dispatch')" type="text">{{expand.dispatch? '收起': '展开'}}</Button>
            <Row v-show="expand.dispatch">
              <i-col span="6" v-if="currentStep === 2">
                <FormItem required label="维修单位">
                  <Input readonly v-model="deptName" placeholder="维护单位"></Input>
                  <div v-show="deptShow" style="border:1px #ccc solid;height:200px;position:absolute;z-index:999;width:100%;background:#fff;overflow:auto;top:-200px">
                    <Tree class='m_tree' :data='tree'></Tree>
                  </div>
                </FormItem>
              </i-col>
              <i-col span="1" v-if="currentStep === 2" style="padding-left:10px">
                <Button type="primary" @click.stop="deptShow = true">选择</Button>
              </i-col>
              <i-col v-if="currentStep === 2" span="1">&nbsp;</i-col>
              <i-col span="6">
                <FormItem required label="查看人">
                  <Select v-if="currentStep === 2" v-model="dispatch.overUserId">
                    <Option v-for="item in wfUserList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
                  </Select>
                  <Input v-else readonly v-model="dispatch.overName" placeholder="查看人"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="联系电话">
                  <Input readonly :value="userPhone('dispatch', 'overUserId', 'overPhone')" placeholder="联系电话"></Input>
                </FormItem>
              </i-col>
              <i-col span="20">
                <FormItem label="派发意见">
                  <Input type="textarea" :readonly="currentStep !==2" v-model="dispatch.disInfo" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="派发意见，不超过120字"></Input>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 查看故障 -->
          <div v-if="currentStep >= 3" style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('lookthrough')" :type="expand.lookthrough? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 查看故障
            </span>
            <Button style="float:right" @click="expandCtrl('lookthrough')" type="text">{{expand.lookthrough? '收起': '展开'}}</Button>
            <Row v-show="expand.lookthrough">
              <i-col span="6" v-if="currentStep === 3">
                <FormItem required label="维修单位">
                  <Input readonly v-model="deptName" placeholder="维修单位"></Input>
                  <div v-show="deptShow" style="border:1px #ccc solid;height:200px;position:absolute;z-index:999;width:100%;background:#fff;overflow:auto;top:-200px">
                    <Tree class='m_tree' :data='tree'></Tree>
                  </div>
                </FormItem>
              </i-col>
              <i-col span="1" v-if="currentStep === 3" style="padding-left:10px">
                <Button type="primary" @click.stop="deptShow = true">选择</Button>
              </i-col>
              <i-col v-if="currentStep === 3" span="1">&nbsp;</i-col>
              <i-col span="6">
                <FormItem required label="查看人">
                  <Select v-if="currentStep === 3" v-model="lookthrough.handleUserId">
                    <Option v-for="item in wfUserList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
                  </Select>
                  <Input v-else readonly v-model="lookthrough.handleName" placeholder="维修人"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="联系电话">
                  <Input readonly :value="userPhone('lookthrough', 'handleUserId', 'handlePhone')" placeholder="联系电话"></Input>
                </FormItem>
              </i-col>
              <i-col :span="currentStep === 3 ? '20': '6'">
                <FormItem label="">
                  <Checkbox :disabled="currentStep !==3" v-model="lookthrough.overType">拆除/维护中</Checkbox>
                </FormItem>
              </i-col>
              <i-col span="20">
                <FormItem label="查看意见">
                  <Input type="textarea" :readonly="currentStep !==3" v-model="lookthrough.overInfo" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="查看意见，不超过120字"></Input>
                </FormItem>
              </i-col>
              <i-col span="14">
                <FormItem label="附件">
                  <Upload v-if="currentStep === 3" ref="upload" :show-upload-list='false' :max-size='2048' :headers="uploadHeaders" :on-error='uploadError' :before-upload="beforeUpload" :on-preview="handleView" :on-success='uploadSuccess' :action="uploadUri">
                    <Button type="default" icon="ios-cloud-upload-outline">上传</Button>
                  </Upload>
                  <div v-if="lookthrough.overFile && lookthrough.overFile.length">
                    <ul class="m_upload">
                      <li v-for="(item, index) in lookthrough.overFile" :key="index+ 'lookthrough'">
                        <i-col span="6">{{item.substring(item.lastIndexOf('/')+1, item.length)}}</i-col>
                        <i-col span="2">
                          <Button type="primary" v-if='!isDownLoad(item)' @click.native="handleView(item)">查看</Button>
                          <a v-if="isDownLoad(item)" :href="downloadUri(item)" target="_blank" :download="'222222'">
                            <Button type="primary">下载</Button>
                          </a>
                        </i-col>
                        <i-col v-if="currentStep === 3" span="2">
                          <Button type="text" @click.native="handleDeleteFile(item)">删除</Button>
                        </i-col>
                        <i-col :span="currentStep === 3 ? 2: 3">
                          &nbsp;
                        </i-col>
                      </li>
                    </ul>
                  </div>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 处理工单 -->
          <div v-if="currentStep >= 4" style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('handle')" :type="expand.handle? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 处理工单
            </span>
            <Button style="float:right" @click="expandCtrl('handle')" type="text">{{expand.handle? '收起': '展开'}}</Button>
            <Row v-show="expand.handle">
              <i-col span="14">
                <FormItem label="故障原因">
                  <Input type="textarea" :readonly="currentStep !==4" v-model="handle.handleInfo" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="故障原因，不超过120字"></Input>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="维修类型">
                  <Checkbox :disabled="currentStep !==4" v-model="handle.handleType">拆除/维护中</Checkbox>
                </FormItem>
              </i-col>
              <i-col span="14">
                <FormItem label="解决方法">
                  <Input type="textarea" :readonly="currentStep !==4" v-model="handle.handleMethod" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="故障原因，不超过120字"></Input>
                </FormItem>
              </i-col>
              <i-col span="14">
                <FormItem label="附件">
                  <Upload v-if="currentStep === 4" ref="upload" :show-upload-list='false' :max-size='2048' :headers="uploadHeaders" :on-error='uploadError' :before-upload="beforeUpload" :on-preview="handleView" :on-success='uploadSuccess' :action="uploadUri">
                    <Button type="default" icon="ios-cloud-upload-outline">上传</Button>
                  </Upload>
                  <div v-if="handle.handleFile && handle.handleFile.length">
                    <ul class="m_upload">
                      <li v-for="(item, index) in handle.handleFile" :key="index+ 'handle'">
                        <i-col span="6">{{item.substring(item.lastIndexOf('/')+1, item.length)}}</i-col>
                        <i-col span="2">
                          <Button type="primary" v-if='!isDownLoad(item)' @click.native="handleView(item)">查看</Button>
                          <a v-if="isDownLoad(item)" :href="downloadUri(item)" target="_blank" :download="'222222'">
                            <Button type="primary">下载</Button>
                          </a>
                        </i-col>
                        <i-col v-if="currentStep === 4" span="2">
                          <Button type='text' @click.native="handleDeleteFile(item)">删除</Button>
                        </i-col>
                        <i-col :span="currentStep === 4 ? 2 :3">
                          &nbsp;
                        </i-col>
                      </li>
                    </ul>
                  </div>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 确认工单 -->
          <div v-if="currentStep >= 5" style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('verify')" :type="expand.verify? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 确认工单
            </span>
            <Button style="float:right" @click="expandCtrl('verify')" type="text">{{expand.verify? '收起': '展开'}}</Button>
            <Row v-show="expand.verify">
              <i-col span="6" v-if="currentStep === 5">
                <FormItem required label="基层评价单位">
                  <Input readonly v-model="deptName" placeholder="基层评价单位"></Input>
                  <div v-show="deptShow" style="border:1px #ccc solid;height:200px;position:absolute;z-index:999;width:100%;background:#fff;overflow:auto;top:-200px">
                    <Tree class='m_tree' :data='tree'></Tree>
                  </div>
                </FormItem>
              </i-col>
              <i-col span="1" v-if="currentStep === 5" style="padding-left:10px">
                <Button @click.stop="deptShow = true">选择</Button>
              </i-col>
              <i-col v-if="currentStep === 5" span="1">&nbsp;</i-col>
              <i-col span="6">
                <FormItem required label="基层评价人">
                  <Select v-if="currentStep === 5" v-model="verify.baseAppraUserId">
                    <Option v-for="item in wfUserList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
                  </Select>
                  <Input v-else readonly v-model="verify.baseAppraName" placeholder="基层评价人"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="联系电话">
                  <Input readonly :value="userPhone('verify', 'baseAppraUserId', 'baseAppraPhone')" placeholder="联系电话"></Input>
                </FormItem>
              </i-col>
              <i-col span="14">
                <FormItem label="确认意见">
                  <Input type="textarea" :readonly="currentStep !==5" v-model="verify.confirmInfo" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="确认意见，不超过120字"></Input>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 基础评价 -->
          <div v-if="currentStep >= 6" style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('baseEval')" :type="expand.baseEval? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 基层评价
            </span>
            <Button style="float:right" @click="expandCtrl('baseEval')" type="text">{{expand.baseEval? '收起': '展开'}}</Button>
            <Row v-show="expand.baseEval">
              <i-col span="6">
                <FormItem required label="科信评价人">
                  <Select placeholder="请选择科信评价人" v-if="currentStep === 6" v-model="baseEval.kexinAppraUserId">
                    <Option v-for="item in wfUserList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
                  </Select>
                  <Input v-else readonly v-model="baseEval.baseAppraName" placeholder="科信评价人"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="联系电话">
                  <Input readonly placeholder="联系电话"></Input>
                </FormItem>
              </i-col>
              <i-col span="2">&nbsp;</i-col>
              <i-col span="6">
                <FormItem label="评价打分">
                  <Rate :disabled="currentStep !== 6" v-model="baseEval.baseAppraScore"></Rate>
                </FormItem>
              </i-col>
              <i-col span="14">
                <FormItem label="评价意见">
                  <Input type="textarea" :readonly="currentStep !==6" v-model="baseEval.baseAppraInfo" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="评价意见，不超过120字"></Input>
                </FormItem>
              </i-col>
            </Row>
          </div>
          <!-- 科信评价 -->
          <div v-if="currentStep >= 7" style="margin-bottom:20px">
            <span style="margin-left:10px">
              <Icon @click="expandCtrl('kexinEval')" :type="expand.kexinEval? 'md-arrow-dropdown': 'md-arrow-dropup'" size="18" style="margin-right:10px" /> 科信评价
            </span>
            <Button style="float:right" @click="expandCtrl('kexinEval')" type="text">{{expand.kexinEval? '收起': '展开'}}</Button>
            <Row v-show="expand.kexinEval">
              <i-col span="6">
                <FormItem label="评价打分">
                  <Rate :disabled="currentStep !== 7" v-model="kexinEval.kexinAppraScore"></Rate>
                </FormItem>
              </i-col>
              <i-col span="14">
                <FormItem label="评价意见">
                  <Input type="textarea" :readonly="currentStep !==7" v-model="kexinEval.kexinAppraInfo" :maxlength='120' :autosize="{minRows: 2,maxRows: 4}" placeholder="评价意见，不超过120字"></Input>
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
              <Steps :current="currentStep">
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
      <!-- 审核按钮 -->
      <span v-if="currentStep === 1">
        <Button style="background:#107ed1;width:100px" type="info" @click="save" size="large">保存</Button>
        <Button style="background:#04bbb7;width:100px" type="info" size="large" @click="ok">通过</Button>
        <Button style="background:#04bbb7;width:100px" type="info" size="large">驳回</Button>
        <Button style="background:#04bbb7;width:120px;" type="info" size="large">创建关联工单</Button>
      </span>
      <!-- 派发按钮组 -->
      <span v-if="currentStep === 2">
        <Button style="background:#107ed1;width:100px" type="info" @click="save" size="large">保存</Button>
        <Button style="background:#04bbb7;width:100px" type="info" size="large" @click="ok">派发</Button>
        <Button style="background:#04bbb7;width:120px;" type="info" size="large">创建关联工单</Button>
      </span>
      <!-- 查看按钮组 -->
      <span v-if="currentStep === 3">
        <Button style="background:#107ed1;width:100px" type="info" @click="save" size="large">保存</Button>
        <Button style="background:#04bbb7;width:100px" type="info" @click="ok" size="large">提交处理</Button>
        <Button style="background:#04bbb7;width:100px" type="info" size="large">提交确认</Button>
        <Button style="background:#04bbb7;width:120px;" type="info" size="large">创建关联工单</Button>
      </span>
      <!-- 处理按钮组 -->
      <span v-if="currentStep === 4">
        <Button style="background:#107ed1;width:100px" type="info" @click="save" size="large">保存</Button>
        <Button style="background:#04bbb7;width:100px" type="info" size="large">检查</Button>
        <Button style="background:#04bbb7;width:100px" type="info" @click="ok" size="large">修复</Button>
        <Button style="background:#04bbb7;width:100px" type="info" size="large">转派</Button>
        <Button style="background:#04bbb7;width:120px;" type="info" size="large">创建关联工单</Button>
      </span>
      <!-- 确认工单按钮组 -->
      <span v-if="currentStep === 5">
        <Button style="background:#04bbb7;width:100px" type="info" @click="ok" size="large">关闭</Button>
        <Button style="background:#04bbb7;width:100px" type="info" size="large">驳回</Button>
        <Button style="background:#04bbb7;width:100px" type="info" size="large">维护期策略</Button>
        <Button style="background:#04bbb7;width:120px;" type="info" size="large">创建关联工单</Button>
      </span>
      <!-- 评价按钮组 -->
      <span v-if="currentStep === 6 || currentStep === 7">
        <Button style="background:#04bbb7;width:100px" type="info" @click="ok" size="large">确定</Button>
      </span>
      <!-- 公共按钮 -->
      <Button style="width:100px;margin-left:10px" type="default" size="large" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
import resource from '@/components/controls/resource'
import abnormal from '@/components/controls/abnormal'
import pickPerson from '@/components/controls/pick'
import * as orderApi from '@/api/order'
// import bus from '@/libs/bus'
import _ from 'lodash'
import { mapState } from 'vuex'
export default {
  components: {
    resource,
    abnormal,
    pickPerson
  },
  props: {
    params: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      defaultTab: 'create',
      deptShow: false, // 控制维护单位显示或隐藏
      deptName: '',
      deptId: '',
      orderList: [],
      uploadList: [], // 待上传文件
      uploadLimit: 6, // 限制上传文件数
      currentStep: 0, // 当前流程节点,0=创建 *
      taskId: '', // 流程节点id
      businessId: '', // 工单编号
      baseForm: {
        resAbnormalName: '', // 告警名称
        resAbnomaltime: '', // 告警时间
        abnormalTypeName: '', // 故障类型
        resAbnormallevelName: '', // 告警等级
        resName: '', // 资源名称
        resAlias: '', // 资源别名
        resMtypeName: '', // 资源主类型名称
        resStypeName: '', // 资源子类型名称
        hopetime: '',
        url: '',
        deadtime: '',
        resIpv4: '', // ip地址
        resAddress: '', // 资源地址
        wfTitle: '', // 工单标题 *
        telephone: '', // 联系电话 *
        resAbnormaldesc: '', // 故障描述 *
        resAbnormalId: '', // 告警序号id
        abnormalTypeId: '', // 故障类型id
        resAbnormallevelId: '', // 故障等级id
        resId: '', // 资源id
        resMtypeId: '', // 主类型id
        resStypeId: '', // 子类型id
        username: '', // 创建人的id
        woSlaId: '' // SLA工单id
      },
      review: {
        reviewUserId: '', // 审核人id
        reviewDesc: '', // 审核意见
        disUserId: '', // 派单人id
        disName: '', // 派单人姓名
        disPhone: '' // 派单人手机号码
      },
      dispatch: {
        disUserId: '', // 派单人id
        disInfo: '', // 派单信息
        overName: '', // 查看人姓名
        overUserId: '', // 查看故障人id
        overPhone: '' // 查看故障人手机号
      },
      lookthrough: {
        overUserId: '', // 查看故障人id
        overInfo: '', // 查看故障信息
        overFile: [], // 查看故障附件
        overType: false, // 查看类型
        handleUserId: '', // 处理人id
        handleName: '', // 处理人名字
        handlePhone: '' // 处理人手机号码
      },
      handle: {
        handleUserId: '', // 处理人id
        handleInfo: '', // 故障原因
        handleMethod: '', // 处理方法
        handleType: false, // 处理类型
        handleFile: '', // 处理附件
        confirmName: '' // 确认人姓名
      },
      verify: {
        confirmUserId: '', // 确认人id
        confirmInfo: '', // 确认意见
        baseAppraUserId: '', // 基础评价人id
        baseAppraName: '', // 基层评价人姓名
        baseAppraPhone: '' // 基础评价人手机号码
      },
      baseEval: {
        baseAppraUserId: '', // 基础评价人id
        baseAppraScore: 0, // 基础评价得分
        baseAppraInfo: '', // 基础评价意见
        kexinAppraUserId: 1, // 科信评价人id
        kexinAppraName: '', // 科信评价人姓名
        kexinAppraPhone: '17768148505' // 科信评价人手机号码
      },
      kexinEval: {
        kexinAppraUserId: '', // 科信评价人
        kexinAppraScore: 0, // 科信评价得分
        kexinAppraInfo: '' // 科信评价意见
      },
      url: [], // 上传的附件路径集合
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
      expand: { // 控制表单域分组的显示和隐藏，配合展开收起一起使用
        resource: false,
        abnormal: false,
        workflow: false,
        review: false,
        dispatch: false,
        lookthrough: false,
        handle: false,
        verify: false,
        baseEval: false,
        kexinEval: false
      },
      stepMap: {
        '1': 'review',
        '2': 'dispatch',
        '3': 'lookthrough',
        '4': 'handle',
        '5': 'verify',
        '6': 'baseEval',
        '7': 'kexinEval'
      },
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 80,
          ellipsis: true,
          className: 'fixHeight',
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
  mounted () {
    // 监控uploadList
    // this.uploadList = this.$refs.upload ? this.$refs.upload.fileList : []
    // console.log('this.upload=', this.$refs)
    // 监控params参数对象
    this.$watch('params', () => {
      if (!this.params.show || !this.params.info.wfId) return
      console.log('处理工单详细信息===', JSON.stringify(this.params.info))
      this.currentStep = this.params.info.currentStep
      this.taskId = this.params.info.taskId
      this.businessId = this.params.info.businessId

      // 基础表单信息装配
      _.forIn(this.baseForm, (value, key) => {
        this.baseForm[key] = this.params.info[key] !== undefined ? this.params.info[key] : _.get(this.params.info, `resBase[${key}]`, '')
      })
      this.baseForm.url = this.baseForm.url ? (_.isArray(this.baseForm.url) ? this.baseForm.url : this.baseForm.url.split('|')) : []
      // 展开工单信息和当前要填写的信息表单域
      _.forIn(this.expand, (v, k) => {
        this.expand[k] = false
      })
      this.expand.workflow = true
      this.expand[this.stepMap[this.currentStep]] = true

      // 流程表单数据信息装配
      const fieldArr = [
        {
          key: 'review',
          map: 'wfReviewInfoModel'
        }, {
          key: 'dispatch',
          map: 'wfDisInfoModel'
        }, {
          key: 'lookthrough',
          map: 'wfOverInfoModel'
        },
        {
          key: 'handle',
          map: 'wfHandleInfoModel'
        },
        {
          key: 'verify',
          map: 'wfConfirmInfoModel'
        },
        {
          key: 'baseEval',
          map: 'wfBaseAppraInfoModel'
        },
        {
          key: 'kexinEval',
          map: 'wfKexinAppraInfoModel'
        }
      ]
      for (let i = 0; i < this.currentStep - 1; i++) {
        const form = this[fieldArr[i].key]
        const origin = this.params.info
        _.forIn(form, (v, k) => {
          form[k] = _.get(origin, `${fieldArr[i].map}.${k}`, '') // 针对流程节点可能没有wfxxxModel字段给出默认值
        })
      }
      this.lookthrough.overFile = this.lookthrough.overFile ? (_.isArray(this.lookthrough.overFile) ? this.lookthrough.overFile : this.lookthrough.overFile.split('|')) : []
      this.handle.handleFile = this.handle.handleFile ? (_.isArray(this.handle.handleFile) ? this.handle.handleFile : this.handle.handleFile.split('|')) : []
      // 装配已保存数据
      if (!window.localStorage.getItem(this.params.info.businessId)) return
      const data = JSON.parse(window.localStorage.getItem(this.params.info.businessId))
      if (this.currentStep !== data.currentStep) return
      this[this.stepMap[this.currentStep]] = data.model
      this.deptName = data.deptName
      this.deptId = data.deptId
    }, { deep: true })

    // 监控deptId
    this.$watch('deptId', () => {
      if (this.deptId === '') return
      this.$store.dispatch('getWfUserList', { stepType: this.currentStep, deptId: this.deptId })
    })
  },
  created () {
    this.$store.dispatch('getOrganizationalUnit', this)
    this.$store.dispatch('getAbnormalType') // 查询故障类型
    document.addEventListener('click', () => {
      if (this.deptShow) this.deptShow = false
    })
  },
  computed: {
    ...mapState({
      level: state => state.statistics.abnormalLevel,
      type: state => state.statistics.abnormalType,
      woSlaId: state => state.order.SLA ? state.order.SLA.woSlaId : '',
      wfUserList: state => state.order.wfUserList
    }),
    baseUrl () {
      return this.baseForm.url
    },
    stepLabelWidth () {
      return (100 / 8) + '%'
    },
    stepLabel () {
      if (!this.params.info.wfId) return []
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
      for (let i = 0; i < this.currentStep - 1; i++) {
        label.push({
          info: _.get(this.params.info, `${keys[i]}.${labelMap[keys[i]].info}`, ''),
          name: _.get(this.params.info, `${keys[i]}.${labelMap[keys[i]].name}`, ''),
          time: _.get(this.params.info, `${keys[i]}.${labelMap[keys[i]].time}`, ''),
          step: this.$store.state.order.flowMap[i + 1],
          index: i + 2
        })
      }
      label.unshift({
        name: this.params.info.username,
        time: this.params.info.gmtCreate,
        info: this.params.info.resAbnormaldesc,
        step: '创建',
        index: 1
      })
      return label
    },
    userPhone (flow, user, phone) {
      return function (flow, user, phone) {
        const list = this.$store.state.order.wfUserList
        const id = this[flow][user]
        this[flow][phone] = id ? (list.find(item => item.userId === id) ? list.find(item => item.userId === id).mobile : '') : this[flow][phone]
        return this[flow][phone]
      }
    },
    uploadUri () { // 上传地址
      return window.config.baseUrl + '/api/resource'
    },
    uploadHeaders () { // 上传请求头
      return {
        Authorization: this.$store.state.user.token
      }
    },
    tree () { // 机构树
      const tree = []
      this.$store.state.user.organizationalUnit.forEach(item => {
        tree.push(this.makeTree(item))
      })
      return tree
    }
  },
  methods: {
    getCurrentUser () { // 获取当前用户的userId
      return this.$store.state.user.userId
    },
    downloadUri (file) { // 下载地址
      return window.config.fileHost + file
    },
    isDownLoad (name) { // 是否可以下载，图片类型对应查看按钮，非图片类型对应下载按钮
      const index = name.lastIndexOf('.')
      const format = name.substring(index + 1, name.length)
      return !this.imgType.includes(format)
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
    },
    handleDeleteFile (file) { // 删除文件，需要把url中也删去
      switch (this.currentStep) {
        case 3:
          this.lookthrough.overFile.splice(this.lookthrough.overFile.findIndex(item => item === file), 1)
          break
        case 4:
          this.handle.handleFile.splice(this.handle.handleFile.findIndex(item => item === file), 1)
          break
        default:
          break
      }
      this.$refs.upload.fileList.splice(this.$refs.upload.fileList.indexOf(file), 1)
    },
    beforeUpload (file) { // upload组件钩子，上传文件前，做对应限制操作，如文件数量的限制
      let fileNum = 0
      switch (this.currentStep) {
        case 3:
          fileNum = this.lookthrough.overFile.length
          break
        case 4:
          fileNum = this.handle.handleFile.length
          break
        default:
          break
      }
      const check = fileNum < this.uploadLimit
      if (!check) this.$Message.error(`最多上传${this.uploadLimit}个文件`)
      return check
    },
    uploadError (error, file, fileList) { // upload组件钩子，上传文件出错函数
      this.$Message.error(JSON.parse(error))
    },
    uploadSuccess (response, file, fileList) { // upload组件钩子，上传成功函数
      if (response.msg !== 'success') return
      switch (this.currentStep) {
        case 3:
          this.lookthrough.overFile.push(response.data)
          break
        case 4:
          this.handle.handleFile.push(response.data)
          break
        default:
          break
      }
    },
    save () { // 保存按钮点击
      window.localStorage.setItem(this.params.info.businessId, JSON.stringify({
        currentStep: this.currentStep,
        model: this[this.stepMap[this.currentStep]],
        deptName: this.deptName,
        deptId: this.deptId
      }))
      this.$Notice.success({ title: '保存成功' })
      this.cancel()
    },
    ok () { // 点击提交按钮
      console.log('jinrule hahah')
      window.localStorage.removeItem(this.params.info.businessId) // 清掉当前节点保存在本地的数据
      switch (this.currentStep) {
        case 0: // 提交创建转审核
          const sub2rew = this.$store.state.order.submitToReview
          this.submit({
            ...sub2rew
          })
          break
        case 1: // 提交审核转派发
          this.submit({
            ...this.review,
            deptId: this.deptId,
            reviewUserId: this.getCurrentUser()
          })
          break
        case 2: // 提交派发转查看
          this.submit({
            ...this.dispatch,
            disUserId: this.getCurrentUser()
          })
          break
        case 3: // 提交查看转处理
          this.submit({
            ...this.lookthrough,
            overFile: this.lookthrough.overFile.join('|'),
            overUserId: this.getCurrentUser()
          })
          break
        case 4: // 提交处理转确认
          this.submit({
            ...this.handle,
            handleFile: this.handle.handleFile.join('|'),
            handleUserId: this.getCurrentUser()
          })
          break
        case 5: // 提交确认转基础评价
          this.submit({
            ...this.verify,
            confirmUserId: this.getCurrentUser()
          })
          break
        case 6: // 提交基础评价转科信评价
          this.submit({
            ...this.baseEval,
            baseAppraUserId: this.getCurrentUser()
          })
          break
        case 7: // 提交科信评级
          this.submit({
            ...this.kexinEval,
            kexinAppraUserId: this.getCurrentUser()
          })
          break
        default:
          break
      }
    },
    submit (params) { // 提交工单流程表单
      orderApi.handleWorkFlow({
        currentStep: this.currentStep,
        taskId: this.taskId,
        businessId: this.businessId,
        ...params
      }).then(res => {
        console.log('提交工单流程表单', JSON.stringify(res))
        if (res.msg !== 'success') return
        this.$store.dispatch('getOrderList', { vue: this, params: { ...this.form } })
        this.cancel()
        this.$Notice.success({
          title: '提交成功'
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
        this.$refs.workflow.resetFields()
        // TODO: h恢复初始值
        this.currentStep = 0
        this.deptName = ''
        this.deptId = ''
        _.forIn(this.expand, (value, key) => {
          this.expand[key] = false
        })
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
      return h(
        'span',
        {
          class: 'ivu-tree-title',
          on: {
            click: e => {
              this.deptName = data.title
              this.deptId = data.id
              this.deptShow = !this.deptShow
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
    },
    expandCtrl (ref) { // 控制流程节点显隐，配合expand使用
      this.expand[ref] = !this.expand[ref]
    }
  }
}
</script>
