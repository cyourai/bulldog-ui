import { asyncRouterMap, constantRouterMap } from '@/router'
import { selectSettingByKey } from '@/api/settings/settings'
import Layout from '@/views/layout/Layout'

const _import = require('@/router/_import_' + process.env.NODE_ENV)// 获取组件的方法

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // 系统管理员不限制权限
    if (roles.indexOf('sys_admin') > 0) return true
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, roles) {
      // 根据角色加载路由表
      return new Promise(resolve => {
        // 可访问路由表
        let accessedRouters
        // 数据库中定义的路由
        let asyncRouterMapFromDB
        selectSettingByKey('menu').then(result => {
          try {
            // 后台获取路由
            asyncRouterMapFromDB = JSON.parse(result.data.settingValue)
          } finally {
            // 路由列表 = 前端定义路由 + 数据库中定义的路由
            accessedRouters = filterAsyncRouter(asyncRouterMap.concat(asyncRouterMapFromDB), roles)
          }
        }).catch(() => {
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        }).finally(() => {
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        })
      })
    }
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter((route) => {
    if (hasPermission(roles, route)) {
      if (route.component && typeof route.component === 'string') {
        // 路由来自数据库需要组件化处理
        if (route.component === 'Layout') {
          route.component = Layout
        } else {
          route.component = _import(route.component)
        }
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    // console.log(route)
    return false
  })
  return accessedRouters
}

export default permission
