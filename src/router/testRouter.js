import Layout from '@/views/layout/Layout'

const testRouter = {
  path: '/test',
  component: Layout,
  redirect: '/test/photoGallery',
  name: 'test',
  meta: {
    title: 'test',
    icon: 'setting',
    roles: ['admin']
  },
  children: [{
    path: 'upload-excel',
    component: () => import('@/views/test/uploadExcel'),
    name: 'upload-excel',
    meta: {
      title: 'uploadExcel'
    }
  },
  {
    path: 'photoGallery',
    component: () => import('@/views/test/photoGallery'),
    name: 'photoGallery',
    meta: {
      title: 'photoGallery'
    }
  },
  {
    path: 'formAdd',
    component: () => import('@/views/test/formAdd'),
    name: 'formAdd',
    meta: {
      title: 'formAdd'
    }
  },
  {
    path: 'picMagnify',
    component: () => import('@/views/test/picMagnify'),
    name: 'picMagnify',
    meta: {
      title: 'picMagnify'
    }
  },
  {
    path: 'media',
    component: () => import('@/views/test/media'),
    name: 'media',
    meta: {
      title: 'media'
    }
  },
  {
    path: 'handsontable',
    component: () => import('@/views/test/handsontable'),
    name: 'handsontable',
    meta: {
      title: 'handsontable'
    }
  },
  {
    path: 'codeMirror',
    component: () => import('@/views/test/codeMirror'),
    name: 'codeMirror',
    meta: {
      title: 'codeMirror'
    }
  },
  {
    path: 'AddTags',
    component: () => import('@/views/test/AddTags'),
    name: 'AddTags',
    meta: {
      title: 'AddTags'
    }
  },
  {
    path: 'bpmn',
    component: () => import('@/views/test/bpmn'),
    name: 'bpmn',
    meta: {
      title: 'bpmn'
    }
  },
  {
    path: 'vueClub',
    component: () => import('@/views/test/vueClub'),
    name: 'vueClub',
    meta: {
      title: 'vueClub'
    }
  },
  {
    path: 'mock',
    component: () => import('@/views/test/mock'),
    name: 'mock',
    meta: {
      title: 'mock'
    }
  }
  ]
}

export default testRouter
