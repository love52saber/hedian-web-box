import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *  overNumber: 默认children长度大于1才在菜单显示父级菜单，如果功能业务指定子功能里只有一个菜单则需要指定overNumber：0即可
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
          notCache: true,
          icon: 'md-home',
          overNumber: 0
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/workSpace',
    name: 'workSpace',
    meta: {
      icon: 'md-planet',
      title: '我的工作台',
      overNumber: 0
    },
    component: Main,
    children: [
      {
        path: 'myOrder',
        name: 'myOrder',
        meta: {
          icon: 'md-reorder',
          title: '我的工单(鉴权示例401)',
          overNumber: 0
        },
        component: () => import('@/view/work-space/my-order.vue')
      }
    ]
  },
  {
    path: '/operationManagement',
    name: 'operationManagement',
    meta: {
      icon: 'md-cog',
      title: '运维管理',
      overNumber: 0
    },
    component: Main,
    children: [
      {
        path: 'order',
        name: 'order',
        meta: {
          icon: 'md-reorder',
          title: '工单管理',
          overNumber: 0
        },
        component: parentView,
        children: [
          {
            path: 'repair',
            name: 'repair',
            meta: {
              icon: 'md-reorder',
              title: '维修工单'
            },
            component: () => import('@/view/operation-management/order-management/repair-order.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/monitorManagement',
    name: 'monitorManagement',
    meta: {
      icon: 'md-bulb',
      title: '监控管理',
      overNumber: 0
    },
    component: Main,
    children: [
      {
        path: 'monitor',
        name: 'monitor',
        meta: {
          icon: 'md-pricetag',
          title: '监测管理',
          overNumber: 0
        },
        component: parentView,
        children: [
          {
            path: 'object',
            name: 'object',
            meta: {
              icon: 'md-cube',
              title: '对象管理'
            },
            component: () => import('@/view/monitor-management/monitor/object.vue')
          },
          {
            path: 'target',
            name: 'target',
            meta: {
              icon: 'logo-buffer',
              title: '监测指标管理'
            },
            component: () => import('@/view/monitor-management/monitor/monitor-target.vue')
          },
          {
            path: 'threshold',
            name: 'threshold',
            meta: {
              icon: 'md-git-commit',
              title: '告警阈值管理'
            },
            component: () => import('@/view/monitor-management/monitor/threshold.vue')
          },
          {
            path: 'domain',
            name: 'domain',
            meta: {
              icon: 'md-build',
              title: '维护域管理'
            },
            component: () => import('@/view/monitor-management/monitor/maintenance-domain.vue')
          }
        ]
      },
      {
        path: 'abnormal',
        name: 'abnormal',
        meta: {
          icon: 'md-alert',
          title: '告警管理',
          overNumber: 0
        },
        component: parentView,
        children: [
          {
            path: 'realTimeAbnormal',
            name: 'realTimeAbnormal',
            meta: {
              icon: 'md-warning',
              title: '实时告警'
            },
            component: () => import('@/view/monitor-management/abnormal/real-time-abnormal.vue')
          },
          {
            path: 'historyAbnormal',
            name: 'historyAbnormal',
            meta: {
              icon: 'md-warning',
              title: '历史告警'
            },
            component: () => import('@/view/monitor-management/abnormal/history-abnormal.vue')
          },
          {
            path: 'ms',
            name: 'ms',
            meta: {
              icon: 'md-bookmark',
              title: '维护期策略'
            },
            component: () => import('@/view/monitor-management/abnormal/maintain-strategy.vue')
          },
          {
            path: 'fms',
            name: 'fms',
            meta: {
              icon: 'md-bookmark',
              title: '故障维护策略'
            },
            component: () => import('@/view/monitor-management/abnormal/fault-maintain-strategy.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/systemManagement',
    name: 'systemManagement',
    meta: {
      icon: 'md-settings',
      title: '系统管理',
      overNumber: 0
    },
    component: Main,
    children: [
      {
        path: 'organitionalUnit',
        name: 'organitionalUnit',
        meta: {
          icon: 'md-contacts',
          title: '组织单位管理',
          overNumber: 0
        },
        component: parentView,
        children: [
          {
            path: 'unit',
            name: 'unit',
            meta: {
              icon: 'md-contacts',
              title: '组织单位'
            },
            component: () => import('@/view/system-management/organizational-unit/unit.vue')
          }
        ]
      },
      {
        path: 'safetyManagement',
        name: 'safetyManagement',
        meta: {
          icon: 'md-umbrella',
          title: '安全管理',
          overNumber: 0
        },
        component: parentView,
        children: [
          {
            path: 'user',
            name: 'user',
            meta: {
              icon: 'md-person',
              title: '用户管理'
            },
            component: () => import('@/view/system-management/safety-management/user.vue')
          },
          {
            path: 'userGroup',
            name: 'userGroup',
            meta: {
              icon: 'md-people',
              title: '用户组管理'
            },
            component: () => import('@/view/system-management/safety-management/user-group.vue')
          },
          {
            path: 'role',
            name: 'role',
            meta: {
              icon: 'md-aperture',
              title: '角色管理'
            },
            component: () => import('@/view/system-management/safety-management/role.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
