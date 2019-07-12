import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// whitelist
const whiteList = ['/login', '/authredirect', '/register', '/resetPassword', '/human', '/maintenance']

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        // 用户登录成功，生成token后获取用户信息及用户角色
        store
          .dispatch('GetUserInfo')
          .then(result => {
            // 拉取user_info
            const user = result.data
            const roles = []
            user.roles.forEach(element => {
              roles.push(element.roleKey)
            })
            if (roles.indexOf('admin') < 0 && roles.indexOf('hradmin') < 0 && roles.indexOf('yqadmin') < 0) {
              // 后台仅限管理员登录
              store.dispatch('FedLogOut').then(() => {
                Message.error('当前用户没有权限进入系统')
                next({ path: '/login' })
              })
            } else {
              store.dispatch('GenerateRoutes', roles).then(() => {
                // 根据roles权限生成可访问的路由表
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              })
            }
          })
          .catch(() => {
            store.dispatch('FedLogOut').then(() => {
              Message.error('无法获取用户信息，请重新登录')
              next({ path: '/login' })
            })
          })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next() //
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// import router from './router'
// import store from './store'
// import NProgress from 'nprogress' // Progress 进度条
// import 'nprogress/nprogress.css' // Progress 进度条样式
// import { getToken } from '@/utils/auth' // 验权

// const whiteList = ['/login']
// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   if (getToken()) {
//     if (to.path === '/login') {
//       // 若已经登录，无需再次登录
//       next({ path: '/' })
//     } else {
//       if (store.getters.roles.length === 0) {
//         store.dispatch('GetUserInfo').then(res => {
//           const roles = res.data.role
//           store.dispatch('GenerateRoutes', { roles }).then(() => {
//             router.addRoutes(store.getters.addRouters)
//             next({ ...to })
//           })
//         })
//       } else {
//         next()
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next('/login')
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   NProgress.done() // 结束Progress
// })
