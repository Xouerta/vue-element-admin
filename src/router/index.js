import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/permission/workbanch',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/WorkFlow.vue',
    alwaysShow: true, // will always show the root menu
    name: '仪表盘',
    meta: {
      title: '仪表盘',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'workbanch',
        component: () => import('@/views/permission/WorkFlow.vue'),
        name: 'PagePermission',
        meta: {
          title: '工作台',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'map',
        component: () => import('@/views/permission/MapView.vue'),
        name: 'DirectivePermission',
        meta: {
          title: '态势大屏'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/RealTime.vue'),
        name: 'RolePermission',
        meta: {
          title: '实时处置流水',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/Bannip',
    component: Layout,
    alwaysShow: true,
    name: 'Bannip',
    meta: {
      title: '封禁管理',
      icon: 'el-icon-s-platform',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/Banned/ipban'),
        name: '己封禁IP',
        meta: { title: '己封禁IP', noCache: true }
      },
      {
        path: 'svg-icons',
        component: () => import('@/views/Banned/Banlog'),
        name: '封禁IP变更日志',
        meta: { title: '封禁IP变更日志', noCache: true }
      }
    ]
  },
  {
    path: '/whiteList',
    component: Layout,
    alwaysShow: true,
    name: 'Icons',
    meta: {
      title: '白名单管理',
      icon: 'el-icon-info',
      roles: ['admin']
    },
    children: [
      {
        path: 'whiteList',
        component: () => import('@/views/whitelist-management/whitelist/index.vue'),
        name: '白名单',
        meta: { title: '白名单', noCache: true }
      },
      {
        path: 'whiteListLogs',
        component: () => import('@/views/whitelist-management/whitelist-logs/index.vue'),
        name: '白名单变更日志',
        meta: { title: '白名单变更日志', noCache: true }
      }
    ]
  },
  {
    path: '/devices',
    component: Layout,
    alwaysShow: true,
    name: 'Icons',
    meta: {
      title: '设备管理',
      icon: 'el-icon-s-management',
      roles: ['admin']
    },
    children: [
      {
        path: 'alarm',
        component: () => import('@/views/devices-management/alarm-device/index.vue'),
        name: '告警设备',
        meta: { title: '告警设备', noCache: true }
      },
      {
        path: 'banned',
        component: () => import('@/views/devices-management/banned-device/index.vue'),
        name: '封禁设备',
        meta: { title: '封禁设备', noCache: true }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    alwaysShow: true,
    name: 'setting',
    meta: {
      title: '系统设置',
      icon: 'el-icon-setting',
      roles: ['admin']
    },
    children: [
      {
        path: '{personal',
        component: () => import('@/views/Setting/Personalset'),
        name: '个人中心',
        meta: { title: '个人中心', noCache: true }
      },
      {
        path: 'all',
        component: () => import('@/views/Setting/Allset'),
        name: '全局配置',
        meta: { title: '全局配置', noCache: true }
      },
      {
        path: 'notice',
        component: () => import('@/views/Setting/Noticeset'),
        name: '通知管理',
        meta: { title: '通知管理', noCache: true }
      },
      {
        path: 'books',
        component: () => import('@/views/Setting/Bookset'),
        name: '证书管理',
        meta: { title: '证书管理', noCache: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
