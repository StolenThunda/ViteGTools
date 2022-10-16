
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/spider', component: () => import('components/SpiderTool.vue') },
      { path: '/tuner', component: () => import('components/ExTuner.vue') },
      { path: '/fretboard', component: () => import('components/FretboardNav.vue') },
      { path: '/metronome', component: () => import('components/MetronomeTool.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
