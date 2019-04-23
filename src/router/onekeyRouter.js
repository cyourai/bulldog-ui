import Layout from '@/views/layout/Layout'

const testRouter = {
  path: '/onekey',
  component: Layout,
  redirect: '/onekey/onekey-index',
  name: 'onekey',
  meta: {
    title: 'onekey',
    icon: 'system_logs',
    roles: ['admin']
  },
  children: [{
    path: 'onekey-index',
    component: () => import('@/views/onekey/onekeyIndex'),
    name: 'onekey-index',
    meta: {
      title: 'onekeyIndex'
    }
  },
  {
    path: 'onekey-start',
    component: () => import('@/views/onekey/onekeyStart'),
    name: 'onekey-start',
    meta: {
      title: 'onekeyStart'
    }
  }
  ]
}

export default testRouter
