/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [{
  path: '/login',
  component: _import('loginPage/index'),
  hidden: true
},
  {
    path: '/register',
    component: _import('loginPage/register'),
    hidden: true
  },
  {
    path: '/resetPassword',
    component: _import('loginPage/resetPassword'),
    hidden: true
  },
  {
    path: '/logout',
    component: _import('loginPage/logout'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: _import('loginPage/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: _import('errorPage/401'),
    hidden: true
  },
  {
    path: '/human',
    component: _import('human/signin'),
    hidden: true
  },
  {
    path: '/checkApp',
    component: _import('maintenance/checkApp'),
    hidden: true
  },
  {
    path: '/checkAppPicture/:checkAppCode',
    component: _import('maintenance/checkAppPicture'),
    hidden: true
  },
  {
    path: '/checkAppEdit/:checkAppCode/:info',
    component: _import('maintenance/checkAppEdit'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: {
        title: 'dashboard',
        icon: 'dashboard',
        noCache: true
      }
    }]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    meta: {
      roles: ['sysadmin']
    },
    hidden: true,
    children: [{
      path: 'index',
      component: _import('documentation/index'),
      name: 'documentation',
      meta: {
        title: 'documentation',
        icon: 'documentation',
        noCache: true
      }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [{
  path: '/permission',
  component: Layout,
  redirect: '/permission/index',
  meta: {
    roles: ['sysadmin']
  }, // you can set roles in root nav
  children: [{
    path: 'index',
    component: _import('permission/index'),
    name: 'permission',
    meta: {
      title: 'permission',
      icon: 'lock'
    }
  }]
},
  {
    path: '/icon',
    component: Layout,
    meta: {
      roles: ['sysadmin']
    },
    children: [{
      path: 'index',
      component: _import('svg-icons/index'),
      name: 'icons',
      meta: {
        title: 'icons',
        icon: 'icon',
        noCache: true
      }
    }]
  },
  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart',
      roles: ['sysadmin']
    },
    children: [{
      path: 'keyboard',
      component: _import('charts/keyboard'),
      name: 'keyboardChart',
      meta: {
        title: 'keyboardChart',
        noCache: true
      }
    },
      {
        path: 'line',
        component: _import('charts/line'),
        name: 'lineChart',
        meta: {
          title: 'lineChart',
          noCache: true
        }
      },
      {
        path: 'mixchart',
        component: _import('charts/mixChart'),
        name: 'mixChart',
        meta: {
          title: 'mixChart',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table/complex-table',
    name: 'example',
    meta: {
      title: 'example',
      icon: 'example',
      roles: ['sysadmin']
    },
    children: [{
      path: '/example/table',
      component: _import('example/table/index'),
      redirect: '/example/table/complex-table',
      name: 'Table',
      meta: {
        title: 'Table',
        icon: 'table'
      },
      children: [{
        path: 'dynamic-table',
        component: _import('example/table/dynamicTable/index'),
        name: 'dynamicTable',
        meta: {
          title: 'dynamicTable'
        }
      },
        {
          path: 'drag-table',
          component: _import('example/table/dragTable'),
          name: 'dragTable',
          meta: {
            title: 'dragTable'
          }
        },
        {
          path: 'inline-edit-table',
          component: _import('example/table/inlineEditTable'),
          name: 'inlineEditTable',
          meta: {
            title: 'inlineEditTable'
          }
        },
        {
          path: 'tree-table',
          component: _import('example/table/treeTable/treeTable'),
          name: 'treeTableDemo',
          meta: {
            title: 'treeTable'
          }
        },
        {
          path: 'custom-tree-table',
          component: _import('example/table/treeTable/customTreeTable'),
          name: 'customTreeTableDemo',
          meta: {
            title: 'customTreeTable'
          }
        },
        {
          path: 'complex-table',
          component: _import('example/table/complexTable'),
          name: 'complexTable',
          meta: {
            title: 'complexTable'
          }
        }
      ]
    },
      {
        path: 'tab/index',
        icon: 'tab',
        component: _import('example/tab/index'),
        name: 'tab',
        meta: {
          title: 'tab'
        }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404',
      roles: ['sysadmin']
    },
    children: [{
      path: '401',
      component: _import('errorPage/401'),
      name: 'page401',
      meta: {
        title: 'page401',
        noCache: true
      }
    },
      {
        path: '404',
        component: _import('errorPage/404'),
        name: 'page404',
        meta: {
          title: 'page404',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: 'log',
      icon: 'log',
      roles: ['sysadmin']
    },
    children: [{
      path: 'log',
      component: _import('errorLog/index'),
      name: 'errorLog',
      meta: {
        title: 'errorLog',
        icon: 'bug'
      }
    }]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'excel',
    meta: {
      title: 'excel',
      icon: 'excel',
      roles: ['sysadmin']
    },
    children: [{
      path: 'export-excel',
      component: _import('excel/exportExcel'),
      name: 'exportExcel',
      meta: {
        title: 'exportExcel'
      }
    },
      {
        path: 'export-selected-excel',
        component: _import('excel/selectExcel'),
        name: 'selectExcel',
        meta: {
          title: 'selectExcel'
        }
      },
      {
        path: 'upload-excel',
        component: _import('excel/uploadExcel'),
        name: 'uploadExcel',
        meta: {
          title: 'uploadExcel'
        }
      }
    ]
  },
  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: {
      title: 'zip',
      icon: 'zip',
      roles: ['sysadmin']
    },
    children: [{
      path: 'download',
      component: _import('zip/index'),
      name: 'exportZip',
      meta: {
        title: 'exportZip'
      }
    }]
  },
  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: 'theme',
      icon: 'theme',
      roles: ['sysadmin']
    },
    children: [{
      path: 'index',
      component: _import('theme/index'),
      name: 'theme',
      meta: {
        title: 'theme',
        icon: 'theme'
      }
    }]
  },
  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['sysadmin']
    },
    children: [{
      path: 'index',
      component: _import('clipboard/index'),
      name: 'clipboardDemo',
      meta: {
        title: 'clipboardDemo',
        icon: 'clipboard'
      }
    }]
  },
  {
    path: '/i18n',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [{
      path: 'index',
      component: _import('i18n-demo/index'),
      name: 'i18n',
      meta: {
        title: 'i18n',
        icon: 'international'
      }
    }]
  },
  {
    path: '/interactive',
    component: Layout,
    redirect: '/interactive/common-element',
    alwaysShow: true,
    meta: {
      title: 'interactive',
      icon: 'zip',
      roles: ['sysadmin']
    },
    children: [
      {
      path: 'common-element',
      component: _import('interactive/commonElement'),
      name: 'commonElement',
        meta: {
          title: 'commonElement'
        }
      },
      {
        path: 'form-element',
        component: _import('interactive/formElement'),
        name: 'formElement',
        meta: {
          title: 'formElement'
        }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/dict',
    alwaysShow: true,
    meta: {
      title: 'settings',
      icon: 'setting',
      roles: ['yqadmin', 'admin', 'hradmin']
    },
    children: [{
      path: 'dict',
      component: _import('settings/dict'),
      name: 'dict',
      meta: {
        title: 'dict'
      }
    },
      {
        path: 'dict-edit',
        component: _import('settings/dictEdit'),
        name: 'dict-edit',
        meta: {
          title: 'dictEdit'
        },
        hidden: true
      },
      {
        path: 'dump',
        component: _import('settings/dump'),
        name: 'dump',
        meta: {
          title: 'dump'
        }
      },
      {
        path: 'log',
        component: _import('settings/log'),
        name: 'log',
        meta: {
          title: 'log',
          roles: ['admin']
        }
      },
      {
        path: 'config',
        component: _import('settings/config'),
        name: 'config',
        meta: {
          title: 'config',
          roles: ['admin']
        }
      },
      {
        path: 'template-msg',
        component: _import('settings/template'),
        name: 'template-msg',
        meta: {
          title: 'templateMsg',
          type: 'msg',
          roles: ['admin']
        }
      },
      {
        path: 'template-mail',
        component: _import('settings/template'),
        name: 'template-mail',
        meta: {
          title: 'templateMail',
          type: 'mail',
          roles: ['admin']
        },
      },
      {
        path: 'template-edit',
        component: _import('settings/templateEdit'),
        name: 'template-edit',
        meta: {
          title: 'templateEdit',
          roles: ['admin']
        },
        hidden: true
      },
      {
        path: 'dict-params',
        component: _import('settings/dictParams'),
        name: 'dict-params',
        meta: {
          title: 'dictParams'
        },
        hidden: true
      },
      {
        path: 'setting-home',
        component: _import('settings/settingHome'),
        name: 'setting-home',
        meta: {
          title: 'settingHome',
          roles: ['yqadmin']
        }
      },
      {
        path: 'notice',
        component: _import('settings/notice'),
        name: 'notice',
        meta: {
          title: 'notice',
          roles: ['admin']
        }
      },
    ]
  },
  {
    path: '/userManager',
    component: Layout,
    redirect: '/userManager/user',
    alwaysShow: true,
    meta: {
      title: 'userManager',
      icon: 'user',
      roles: ['hradmin', 'admin']
    },
    children: [{
      path: 'user',
      component: _import('userManager/user'),
      name: 'user',
      meta: {
        title: 'user'
      }
    },
      {
        path: 'user-edit',
        component: _import('userManager/userEdit'),
        name: 'user-edit',
        meta: {
          title: 'userEdit'
        },
        hidden: true
      },
      {
        path: 'role',
        component: _import('userManager/role'),
        name: 'role',
        meta: {
          title: 'access'
        }
      },
      {
        path: 'role-edit',
        component: _import('userManager/roleEdit'),
        name: 'role-edit',
        meta: {
          title: 'roleEdit'
        },
        hidden: true
      },
      {
        path: 'organization',
        component: _import('userManager/organization'),
        name: 'organization',
        meta: {
          title: 'organization',
          roles: ['admin']
        }
      },
      {
        path: 'access',
        component: _import('userManager/access'),
        name: 'access',
        meta: {
          title: 'access',
          roles: ['admin']
        },
        hidden: true
      },
      {
        path: 'access-edit',
        component: _import('userManager/accessEdit'),
        name: 'access-edit',
        meta: {
          title: 'accessEdit'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/human',
    component: Layout,
    redirect: '/human/signin',
    alwaysShow: true,
    meta: {
      title: 'human',
      icon: 'form',
      roles: ['hradmin']
    },
    children: [{
      path: 'signList',
      component: _import('human/signList'),
      name: 'humanSignin',
      meta: {
        title: 'humanSignin'
      }
    }, {
      path: 'signEdit',
      component: _import('human/signEdit'),
      name: 'signEdit',
      meta: {
        title: 'humanEdit'
      },
      hidden: true
    }]
  },
  {
    path: '/mail',
    component: Layout,
    redirect: '/mail/inbox',
    meta: {
      title: 'mail',
      icon: 'email'
    },
    children: [{
      path: 'inbox',
      component: _import('mail/inbox'),
      name: 'inbox',
      meta: {
        title: 'inbox'
      }
    },
      {
        path: 'outbox',
        component: _import('mail/outbox'),
        name: 'outbox',
        meta: {
          title: 'outbox'
        }
      }
    ]
  },
  {
    path: '/script',
    component: Layout,
    redirect: '/script/scriptList',
    alwaysShow: false,
    meta: {
      title: 'script',
      icon: 'pen',
      roles: ['admin']
    },
    children: [{
      path: 'scriptList',
      component: _import('script/scriptList'),
      name: 'scriptList',
      meta: {
        title: 'scriptList'
      }
    },
      {
        path: 'scriptEdit',
        component: _import('script/scriptEdit'),
        name: 'script-edit',
        meta: {
          title: 'scriptEdit'
        },
        hidden: true
      },
      {
        path: 'templateList',
        component: _import('script/templateList'),
        name: 'templateList',
        meta: {
          title: 'templateList'
        },
        hidden: true
      },
      {
        path: 'templateEdit',
        component: _import('script/templateEdit'),
        name: 'templateEdit',
        meta: {
          title: 'templateEdit'
        },
        hidden: true
      },
      {
        path: 'resultCheck',
        component: _import('script/resultCheck'),
        name: 'resultCheck',
        meta: {
          title: 'resultCheck'
        },
        hidden: true
      },
      {
        path: 'resultCheckEdit',
        component: _import('script/resultCheckEdit'),
        name: 'resultCheckEdit',
        meta: {
          title: 'resultCheckEdit'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/maintenance',
    component: Layout,
    redirect: '/maintenance/checkAppList',
    alwaysShow: true,
    meta: {
      title: 'operationsManagement',
      icon: 'check',
      roles: ['admin']
    },
    children: [
      {
        path: 'checkAppList',
        component: _import('maintenance/checkAppList'),
        name: 'checkApp',
        meta: {
          title: 'checkApp'
        }
      },
      {
        path: 'checkAppEdit',
        component: _import('maintenance/checkAppEdit'),
        name: 'checkAppEdit',
        meta: {
          title: 'checkAppEdit'
        },
        hidden: true
      },
      {
        path: 'checkAppPicture',
        component: _import('maintenance/checkAppPicture'),
        name: 'checkAppPicture',
        meta: {
          title: 'checkAppEdit'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/gallery',
    component: Layout,
    redirect: '/gallery/photoGallery',
    alwaysShow: true,
    meta: {
      title: 'material',
      icon: 'pic',
      roles: ['admin']
    },
    children: [{
      path: 'photoGallery',
      component: _import('gallery/photoGallery'),
      name: 'PhotoGallery',
      meta: {
        title: 'photoGallery',
        roles: ['admin', 'yqadmin']
      }
    },
      {
        path: 'scriptGallery',
        component: _import('gallery/scriptGallery'),
        name: 'ScriptGallery',
        meta: {
          title: 'scriptGallery',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/model',
    component: Layout,
    redirect: '/pageModel/pageComponent',
    meta: {
      title: 'pageModel',
      roles: ['sysadmin']
    },
    children: [{
      path: 'page-component',
      component: _import('pageModel/pageComponent'),
      name: 'page-component',
      meta: {
        title: 'pageComponent',
        icon: 'example'
      }
    }]
  }
]
