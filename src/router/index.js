import {createRouter, createWebHashHistory, createWebHistory, onBeforeRouteUpdate} from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: '工具'
      },
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/pdf',
      name: 'pdf-tool',
      meta: {
        title: 'PDF工具'
      },
      component: () => import('../views/PDFTool.vue'),
    },
  ],
});


router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  console.log(to);
  if (to.meta) {
    document.title = to.meta.title;
  }
})

export default router
