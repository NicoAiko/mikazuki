import type Router from 'vue-router';
import type { NavigationGuardNext, Route } from 'vue-router';
import store from '@/store';

export function beforeEachInterceptor(router: Router) {
  router.beforeEach((to: Route, _from: Route, next: NavigationGuardNext) => {
    const isAuthenticated = store.getters['userSettings/isAuthenticated'];

    if (to.meta?.unauthorizedOnly && isAuthenticated) {
      next({ name: 'Home' });
      return;
    }

    if (!to.meta?.unauthorizedOnly && !isAuthenticated) {
      next({ name: 'Login' });
      return;
    }

    next();
  });
}
