import Vue from 'vue';
import Router from 'vue-router';
import AniList from '@/routes/AniList';
import Search from '@/views/Search.vue';
import Settings from '@/views/Settings.vue';

// TODO: Replace with async import
import Login from '@/views/Login/Login.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    ...AniList,
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        routeName: 'settings',
      },
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {
        searchablePage: true,
        routeName: 'search',
      },
      children: [
        {
          path: ':query',
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      // component: () => import(/* webpackChunkName: "login" */ './views/Login/Login.vue'),
      component: Login,
    },
    {
      path: '*',
      redirect: '/aniList',
    },
  ],
});

export default router;
