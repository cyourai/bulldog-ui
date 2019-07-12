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
    path: '/maintenance',
    component: _import('maintenance/checkApp'),
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
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: 'components',
      icon: 'component',
      roles: ['sysadmin']
    },
    children: [{
      path: 'tinymce',
      component: _import('components-demo/tinymce'),
      name: 'tinymce-demo',
      meta: {
        title: 'tinymce'
      }
    },
      {
        path: 'markdown',
        component: _import('components-demo/markdown'),
        name: 'markdown-demo',
        meta: {
          title: 'markdown'
        }
      },
      {
        path: 'json-editor',
        component: _import('components-demo/jsonEditor'),
        name: 'jsonEditor-demo',
        meta: {
          title: 'jsonEditor'
        }
      },
      {
        path: 'dnd-list',
        component: _import('components-demo/dndList'),
        name: 'dndList-demo',
        meta: {
          title: 'dndList'
        }
      },
      {
        path: 'splitpane',
        component: _import('components-demo/splitpane'),
        name: 'splitpane-demo',
        meta: {
          title: 'splitPane'
        }
      },
      {
        path: 'avatar-upload',
        component: _import('components-demo/avatarUpload'),
        name: 'avatarUpload-demo',
        meta: {
          title: 'avatarUpload'
        }
      },
      {
        path: 'dropzone',
        component: _import('components-demo/dropzone'),
        name: 'dropzone-demo',
        meta: {
          title: 'dropzone'
        }
      },
      {
        path: 'sticky',
        component: _import('components-demo/sticky'),
        name: 'sticky-demo',
        meta: {
          title: 'sticky'
        }
      },
      {
        path: 'count-to',
        component: _import('components-demo/countTo'),
        name: 'countTo-demo',
        meta: {
          title: 'countTo'
        }
      },
      {
        path: 'mixin',
        component: _import('components-demo/mixin'),
        name: 'componentMixin-demo',
        meta: {
          title: 'componentMixin'
        }
      },
      {
        path: 'back-to-top',
        component: _import('components-demo/backToTop'),
        name: 'backToTop-demo',
        meta: {
          title: 'backToTop'
        }
      }
    ]
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
    path: '/form',
    component: Layout,
    redirect: 'noredirect',
    name: 'form',
    meta: {
      title: 'form',
      icon: 'form',
      roles: ['sysadmin']
    },
    children: [{
      path: 'create-form',
      component: _import('form/create'),
      name: 'createForm',
      meta: {
        title: 'createForm',
        icon: 'table'
      }
    },
      {
        path: 'edit-form',
        component: _import('form/edit'),
        name: 'editForm',
        meta: {
          title: 'editForm',
          icon: 'table'
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
        path: 'menuEdit',
        component: _import('settings/menuEdit'),
        name: 'menuEdit',
        meta: {
          title: 'menuEdit',
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
        }
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
    path: '/approveHistory',
    component: Layout,
    redirect: '/approve/history/approveHistory',
    meta: {},
    hidden: true,
    children: [{
      path: '/approve/history/approveHistory',
      component: _import('approve/history/approveHistory'),
      name: 'approveHistory',
      meta: {
        title: 'approveHistory',
      }
    }]
  },
  {
    path: '/approve',
    component: Layout,
    redirect: '/approve/approve',
    meta: {
      title: 'approve',
      icon: 'edit',
      roles: ['yqadmin']
    },
    children: [{
      path: 'approve',
      component: _import('approve/approve'),
      name: 'approve',
      meta: {
        title: 'approveRegister',
      }
    },
      {
        path: 'approveRegisterInfo',
        component: _import('approve/approveRegisterInfo'),
        name: 'approveRegisterInfo',
        meta: {
          title: 'approveRegisterInfo',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'history/approveRegisterHistory',
        component: _import('approve/history/approveRegisterHistory'),
        name: 'approveRegisterHistory',
        meta: {
          title: 'approveRegisterHistory',
        }
      },
      {
        path: 'history/approveRegisterHistoryInfo',
        component: _import('approve/history/approveRegisterHistoryInfo'),
        name: 'approveRegisterHistoryInfo',
        meta: {
          title: 'approveRegisterHistoryInfo',
        },
        hidden: true
      }
    ]
  },
  {
    path: '/processManager',
    component: Layout,
    redirect: '/processManager/processList',
    alwaysShow: false,
    meta: {
      title: 'processManager',
      icon: 'process',
      roles: ['admin']
    },
    children: [{
      path: 'process-edit',
      component: _import('processManager/processEdit'),
      name: 'process-edit',
      meta: {
        title: 'processEdit'
      },
      hidden: true
    },
      {
        path: 'modeler',
        component: _import('processManager/modeler'),
        name: 'modeler',
        meta: {
          title: 'processEdit'
        },
        hidden: true
      },
      {
        path: 'process-deploy',
        component: _import('processManager/processDeploy'),
        name: 'process-deploy',
        meta: {
          title: 'processDesign'
        }
      },
      {
        path: 'drill-simulation',
        component: _import('processManager/drill'),
        name: 'drill-simulation',
        meta: {
          title: 'drillSimulation',
          type: 'simulation'
        }
      },
      {
        path: 'drill-real',
        component: _import('processManager/drill'),
        name: 'drill-real',
        meta: {
          title: 'drillReal',
          type: 'real'
        }
      },
      {
        path: 'sign-in/:imgSignUrl/:id',
        component: _import('processManager/signIn'),
        name: 'sign-in',
        meta: {
          title: 'signIn'
        },
        hidden: true
      },
      {
        path: 'task',
        component: _import('processManager/task'),
        name: 'task',
        meta: {
          title: 'allTask',
          type: 'all'
        }
      },
      {
        path: 'my-task',
        component: _import('processManager/task'),
        name: 'my-task',
        meta: {
          title: 'myTask',
          type: 'my'
        }
      },
      {
        path: 'execute',
        component: _import('processManager/execute'),
        name: 'execute',
        meta: {
          title: 'execute',
        },
        hidden: true
      },
      {
        path: 'result-list',
        component: _import('processManager/resultList'),
        name: 'result-list',
        meta: {
          title: 'resultList',
        }
      },
      {
        path: 'result-chart',
        component: _import('processManager/resultChart'),
        name: 'result-chart',
        meta: {
          title: 'resultChart',
        },
        hidden: true
      },
      {
        path: 'validate',
        component: _import('processManager/validate'),
        name: 'validate',
        meta: {
          title: 'validate',
        }
      },
      {
        path: 'validate-edit',
        component: _import('processManager/validateEdit'),
        name: 'validate-edit',
        meta: {
          title: 'validateEdit',
        },
        hidden: true
      },
      {
        path: 'process-modeler',
        component: _import('processManager/processModeler'),
        name: 'process-modeler',
        meta: {
          title: 'processModeler',
        },
        hidden: true
      }
    ]
  },
  {
    path: '/process/modelId/:modelId',
    component: Layout,
    redirect: '/process/modelId/:modelId',
    hidden: true,
    children: [{
      path: '/',
      component: _import('processManager/index'),
    }]
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
    path: '/jobsManager',
    component: Layout,
    redirect: '/jobsManager/jobs',
    alwaysShow: true,
    meta: {
      title: 'jobsManager',
      icon: 'form',
      roles: ['admin']
    },
    children: [{
      path: 'jobs',
      component: _import('jobsManager/jobs'),
      name: 'jobs',
      meta: {
        title: 'jobs'
      }
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
    redirect: '/maintenance/checkApp',
    alwaysShow: true,
    meta: {
      title: 'operationsManagement',
      icon: 'check',
      roles: ['admin']
    },
    children: [
      {
        path: 'checkApp',
        component: _import('maintenance/checkApp'),
        name: 'checkApp',
        meta: {
          title: 'checkApp'
        }
      }
    ]
  },
  {
    path: '/assets',
    component: Layout,
    redirect: '/assets/server',
    meta: {
      title: 'assets',
      icon: 'discount',
      roles: ['admin']
    },
    children: [{
      path: 'server',
      component: _import('assets/server'),
      name: 'server',
      meta: {
        title: 'server',
        roles: ['admin']
      }
    },
      {
        path: 'serverEdit',
        component: _import('assets/serverEdit'),
        name: 'serverEdit',
        meta: {
          title: 'serverEdit'
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
