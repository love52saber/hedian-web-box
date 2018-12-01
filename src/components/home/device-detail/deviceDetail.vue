<template>
  <card-modal class="g_device_detail" v-show="show">
    <Icon @click.stop="$emit('switch')" slot="extra" type="md-close" style="cursor:pointer" size="25" />
    <equip-box :is-show="show" />
    <div class="device-alarm-container">
      <Table height="300" :columns="columns" :data="deviceAlarm"></Table>
    </div>
    <abnormal-form ref="form" :form-data="formData" />
  </card-modal>
</template>

<script>
import CardModal from '_c/card-modal'
import EquipBox from '_c/home/device/equipbox'
import moment from 'dayjs'
import './deviceDetail.less'
import { mapState, mapActions } from 'vuex'
import AbnormalForm from '_c/abnormal/form'
import bus from '@/libs/bus'
export default {
  name: 'DeviceDetail',
  components: {
    CardModal,
    EquipBox,
    AbnormalForm
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {
        show: false,
        action: '告警确认',
        callback: null,
        info: {}
      },
      columns: [
        {
          title: '序号',
          key: 'resAbnormalId',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.resAbnormalId
              }
            }, row.resAbnormalId)
          }
        },
        {
          title: '级别',
          key: 'alarmLevel',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('Tag', {
              props: {
                color: row.alarmColor
              }
            }, row.alarmLevel)
          }
        },
        {
          title: '故障码',
          key: 'alarmCode',
          ellipsis: true,
          align: 'center',
          sortable: true,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.alarmCode
              }
            }, row.alarmCode)
          }
        },
        {
          title: '故障名称',
          key: 'alarmName',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.alarmName
              }
            }, row.alarmName)
          }
        },
        {
          title: '告警对象',
          key: 'alarmObject',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.alarmObject
              }
            }, row.alarmObject)
          }
        },
        {
          title: '告警对象类型',
          key: 'alarmObjectType',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.alarmObjectType
              }
            }, row.alarmObjectType)
          }
        },
        {
          title: '告警对象别名',
          key: 'alarmObjectAlias',
          ellipsis: true,
          align: 'center',
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.alarmObjectAlias
              }
            }, row.alarmObjectAlias)
          }
        },
        {
          title: '发生时间',
          key: 'alarmTime',
          ellipsis: true,
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            row.alarmTime = moment(row.alarmTime).format('YYYY-MM-DD HH:mm:ss')
            return h('span', {
              attrs: {
                title: row.alarmTime
              }
            }, row.alarmTime)
          }
        },
        {
          title: '详细信息',
          key: 'alarmDesc',
          ellipsis: true,
          align: 'center',
          width: 200,
          render: (h, { row }) => {
            return h('span', {
              attrs: {
                title: row.alarmDesc
              }
            }, row.alarmDesc)
          }
        },
        {
          title: '操作',
          width: 120,
          align: 'center',
          render: (h, { row }) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-checkmark-circle-outline',
                  color: row.confirmStatus === 1 ? '#04bbb7' : '#bbb7b7',
                  size: 20
                },
                attrs: {
                  title: '确认'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (row.confirmStatus === 2) return
                    this.formData.action = '告警确认'
                    this.formData.info = row
                    this.formData.callback = this.confirmCallback
                    this.formData.show = true
                  }
                }
              }),
              // TODO:派单功能暂时没有，空着先
              h('Icon', {
                props: {
                  type: 'md-redo',
                  // color: row.dispatchType === 0 ? '#04bbb7' : '#bbb7b7',
                  color: '#ccc',
                  size: 20
                },
                attrs: {
                  title: '派单功能敬请期待'
                },
                style: {
                  marginRight: '10px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    // if (row.dispatchType) return
                    console.log(row)
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'md-log-out',
                  color: row.cleanType === 0 ? '#04bbb7' : '#bbb7b7',
                  size: 20
                },
                attrs: {
                  title: '清除'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    if (row.cleanType) return
                    this.formData.action = '告警清除'
                    this.formData.info = row
                    this.formData.callback = this.cleanCallback
                    this.formData.show = true
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
      deviceAlarm: state => state.device.deviceAlarm
    })
  },
  methods: {
    ...mapActions([
      'confirmAbnormal',
      'cleanAbnormal'
    ]),
    confirmCallback (params, isFinal = false) {
      const { resAbnormalId, value } = params
      this.confirmAbnormal({ resAbnormalId, confirmInfo: value }).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '故障确认成功' })
        this.formData.show = false
        this.$refs.form.clear()
        bus.$emit('shouldUpdatePage') // 更新首页数据
        this.$store.dispatch('getRealTimeAlarmList')
      })
    },
    cleanCallback (params, isFinal = false) {
      const { resAbnormalId, value } = params
      this.cleanAbnormal({ resAbnormalId, cleanInfo: value }).then(res => {
        if (res.msg !== 'success') return
        if (!isFinal) return
        this.$Notice.success({ title: '故障清除成功' })
        this.formData.show = false
        this.$refs.form.clear()
        bus.$emit('shouldUpdatePage') // 更新首页数据
        this.$store.dispatch('getRealTimeAlarmList')
      })
    }
  }
}
</script>
