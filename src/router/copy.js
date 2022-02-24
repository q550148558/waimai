import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import VueRouter from 'vue-router'


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
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * 初始路由
 */
export const constantRoutes = [
  {
    path: '/manager/login',
    name: 'Login' ,
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: { title: '物流管理登录' }
  },
  {
    path:'/404',
    name:'Error',
    component: () => import('@/views/404'),
    hidden: true,
    meta: { title: '错误页' }
  },
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true, meta: { title: '错误页' } }
]

//需要后台权限判断 筛选其中的进行加载
export const asyncRoutes=[
  {
    path: '/manager',
    component: Layout,
    redirect: '/manager/dashboard',
    name:'Welcome',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/manager/priviledge',
    name:'Priviledge',
    component: Layout,
    redirect: '/manager/priviledge/UserMgn',
    meta: { title: '权限管理', icon: 'el-icon-s-help' },
    children: [{
        path: 'UserMgn',
        name: 'UserMgn',
        component: () => import('@/views/priviledge/user/index'),
        meta: { title: '用户管理', icon: 'form' }
      },
      {
        path: 'RoleMgn',
        name: 'RoleMgn',
        component: () => import('@/views/priviledge/user/index'),
        meta: { title: '角色管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/manager/example',
    component: Layout,
    redirect: '/manager/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/manager/form',
    component: Layout,
    children: [
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/manager/nested',
    component: Layout,
    redirect: '/manager/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }
]

//递归并拿出用户有权限的router
function getPermissionRouters(routes,routerNameList){
  const res=[]
  routes.forEach(route => {
    const tmp={ ...route }
    if(routerNameList.includes(tmp.name)){
      if(tmp.children){
        tmp.children=getPermissionRouters(tmp.children,routerNameList);
      }
      res.push(tmp)
    }
  });
  return res
}




const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const createAsynRouter = (r) => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: r
})

const router = createRouter()

/**
 * 过滤并加载新的路由
 * routes格式为后台传入的值 例如routes=['Login']
 * 
 */
 export function filterAsyncRoutes(routes){
  alert(1)
  const newRoutes_rules=getPermissionRouters(asyncRoutes,routes);//进行递归
  const res=constantRoutes.concat(newRoutes_rules);
  res.push({ path: '*', redirect: '/404', hidden: true, meta: { title: '错误页' }})
  router.addRoutes(res)
  return res
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
