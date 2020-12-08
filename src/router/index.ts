import { createRouter, createWebHashHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 基础模板
const Layout = () => import( /* webpackChunkName: "Layout" */'../layout/layout')
// 登录
const Login = () => import(/* webpackChunkName: "Login" */'../views/no-permission/login')
// 看板
const DashBoard = () => import(/* webpackChunkName: "DashBoard" */'../views/permission/board/dash-board')
// 用户列表
const UserList = () => import(/* webpackChunkName: "UserList" */'../views/permission/user/user-list')
// 404
const NoPage = () => import(/* webpackChunkName: "NoPage" */'../views/no-permission/404')
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      auth: false
    },
    component: Login
  },
  {
    path: '/error-page',
    name: 'ErrorPage',
    meta: {
      auth: false
    },
    component: Layout,
    children: [
      {
        path: '/error-page/404',
        name: 'NoPage',
        meta: {
          auth: false
        },
        component: NoPage
      }
    ]
  }
]

export const authRoutes: Array<RouteRecordRaw> = [
  {
    path: '/board',
    name: 'Board',
    meta: {
      key: 'board',
      title: '看板',
      auth: true,
      permissions: ['a', 'b']
    },
    component: Layout,
    children: [
      {
        path: '/board/dashboard',
        name: 'DashBoard',
        meta: {
          key: 'dash-board',
          auth: true,
          title: '数据概览',
          permissions: ['a', 'b']
        },
        component: DashBoard
      },
      {
        path: '/board/datalist',
        name: 'DataList',
        meta: {
          key: 'data-list',
          auth: true,
          title: '数据统计列表',
          permissions: ['a', 'b']
        },
        component: DashBoard,
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    meta: {
      key: 'user',
      auth: true,
      title: '用户管理',
      permissions: ['a', 'b']
    },
    component: Layout,
    children: [
      {
        path: '/user/user-list',
        name: 'UserList',
        meta: {
          key: 'user-list',
          auth: true,
          title: '用户列表',
          permissions: ['a', 'b']
        },
        component: UserList
      }
    ]
  }
]
// 递归权限路由，筛选符合的路由列表
const hasAuth = (r: RouteRecordRaw, auth: string) => {
  return r.meta?.permissions.some((p: string) => p === auth)
}
const permissionRoutes = (routes: RouteRecordRaw[], auth: string) => {
  let newRoutes: RouteRecordRaw[];
  newRoutes = routes.reduce((newRoutes: RouteRecordRaw[], route: RouteRecordRaw): RouteRecordRaw[] => {
    let r = route;
    if (r.children?.length === 1) {
      // 如果有子路由数量为1，判断当前路由和子路由权限
      if (hasAuth(r, auth) && hasAuth(r.children[0], auth)) {
        // newRoutes.push(r)
        return [...newRoutes, r]
      }
      return newRoutes
    } else {
      // 如果有多个子路由，先判断父路由权限
      if (!hasAuth(r, auth)) {
        // 如果父路由没有权限，直接返回
        return newRoutes
      } else {
        // 如果父路由有权限，递归子路由
        const childRoutes = permissionRoutes(r.children ? r.children : [], auth);
        if (childRoutes.length !== 0) {
          r.children = childRoutes
        }
        // newRoutes.push(r)
        return [...newRoutes, r]
      }
    }
  }, []);
  return newRoutes
}
export let userRoutes: RouteRecordRaw[] = [];
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// router.addRoute(authRoutes[0])
// router.addRoute(authRoutes[1])
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  console.log(to, routes)
  // 如果非授权列表中没有要进入的路由
  NProgress.start();
  const token = localStorage.getItem('token');
  if(to.path == '/' && token){
    next('/board/dashboard')
  }
  if (routes.filter(r => r.path === to.path).length !== 0) {
    next()
  } else {
    // 如果进入的路由不在非权限路由内
    // console.log('如果进入的路由不在非权限路由内')
    console.log(token);
    if (!token) {
      console.log('没有token，去登录')
      next('/login')
    } else {
      //  当前路由
      const currentRouteList = router.getRoutes();
      // console.log(currentRouteList)
      if (currentRouteList.length === 3) {
        userRoutes = permissionRoutes(authRoutes, 'a');
      }
      if (currentRouteList.filter(r => r.path === to.path).length === 0) {
        // 当前添加的路由列表没有该路由
        // 找到进入路由所在父路由
        const route = userRoutes.filter(r => {
          return JSON.stringify(r).includes(to.path)
        })
        if (route.length !== 0) {
          router.addRoute(route[0])
          next(to.path)
        } else {
          console.log('没有权限')
          next('/404')
        }
      } else {
        next()
      }
    }


  }

})
router.afterEach((to) => {
  NProgress.done();
})
export default router
