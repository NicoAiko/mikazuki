import Vue from 'vue';
import Router from 'vue-router';
import AniList from './routes/AniList';
import Misc from './routes/Misc';
import { beforeEachInterceptor } from './beforeEach.interceptor';

Vue.use(Router);

const router = new Router({
  routes: [
    ...AniList,
    ...Misc,
    {
      path: '*',
      redirect: '/aniList',
    },
  ],
});

beforeEachInterceptor(router);

export default router;
