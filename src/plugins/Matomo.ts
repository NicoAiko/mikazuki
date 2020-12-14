import router from '@/router';

export default {
  router,
  requireConsent: true,
  trackerFileName: process.env.VUE_APP_MATOMO_TRACKERFILENAME,
  host: process.env.VUE_APP_MATOMO_HOST,
  siteId: process.env.VUE_APP_MATOMO_SITEID,
  enableLinkTracking: false,
  enableHeatBeatTimer: true,
  debug: process.env.NODE_ENV !== 'production',
  domains: process.env.VUE_APP_MATOMO_DOMAINS,
};

declare module 'vue/types/vue' {
  interface Vue {
    $matomo: any;
  }
}
